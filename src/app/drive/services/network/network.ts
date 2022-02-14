import { Environment } from '@internxt/inxt-js';
import { ActionState, FileInfo } from '@internxt/inxt-js/build/api';
import { Readable } from 'stream';
import localStorageService from '../../../core/services/local-storage.service';
import { UserSettings } from '@internxt/sdk/dist/shared/types/userSettings';
import { TeamsSettings } from '../../../teams/types';
import { randomBytes } from 'crypto';
import { finishUpload, getUploadUrl, prepareUpload, ShardMeta } from './requests';
import { calculateEncryptedFileHash, uploadFile } from './upload';
import { createAES256Cipher, encryptFilename } from './crypto';
import { v4 } from 'uuid';
import { EventEmitter } from 'events';

export const MAX_ALLOWED_UPLOAD_SIZE = 50 * 1024 * 1024 * 1024;

type ProgressCallback = (progress: number, uploadedBytes: number | null, totalBytes: number | null) => void;
interface IUploadParams {
  filesize: number;
  filecontent: File;
  progressCallback: ProgressCallback;
}

interface IDownloadParams {
  fileToken?: string;
  fileEncryptionKey?: Buffer;
  progressCallback: ProgressCallback;
}

interface EnvironmentConfig {
  bridgeUser: string;
  bridgePass: string;
  encryptionKey: string;
  bucketId: string;
  useProxy: boolean;
}

interface Abortable {
  stop: () => void
}

class UploadAbortedError extends Error {
  constructor() {
    super('Upload aborted');
  }
}

export class Network {
  private environment: Environment;

  private mnemonic: string;

  private creds: {
    user: string;
    pass: string;
  };

  constructor(bridgeUser: string, bridgePass: string, encryptionKey: string) {
    if (!bridgeUser) {
      throw new Error('Bridge user not provided');
    }

    if (!bridgePass) {
      throw new Error('Bridge pass not provided');
    }

    if (!encryptionKey) {
      throw new Error('Mnemonic not provided');
    }

    this.creds = {
      user: bridgeUser,
      pass: bridgePass,
    };

    this.mnemonic = encryptionKey;

    this.environment = new Environment({
      bridgePass,
      bridgeUser,
      encryptionKey,
      bridgeUrl: process.env.REACT_APP_STORJ_BRIDGE,
    });
  }

  /**
   * Uploads a file to the Internxt Network
   * @param bucketId Bucket where file is going to be uploaded
   * @param params Required params for uploading a file
   * @returns Id of the created file
   */
  uploadFile(bucketId: string, params: IUploadParams): [Promise<string>, Abortable | undefined] {
    let actionState: ActionState | undefined;

    if (!bucketId) {
      throw new Error('Bucket id not provided');
    }

    return this.doUpload(bucketId, params);
  }

  /**
   * Downloads a file from the Internxt Network
   * @param bucketId Bucket where file is uploaded
   * @param fileId Id of the file to be downloaded
   * @param params Required params for downloading a file
   * @returns
   */
  downloadFile(bucketId: string, fileId: string, params: IDownloadParams): [Promise<Blob>, ActionState | undefined] {
    const [downloadStreamPromise, actionState] = this.getFileDownloadStream(bucketId, fileId, params);

    let errored = false;

    const promise = new Promise<Blob>((resolve, reject) => {
      downloadStreamPromise
        .then((downloadStream) => {
          const chunks: Buffer[] = [];
          downloadStream
            .on('data', (chunk: Buffer) => {
              chunks.push(chunk);
            })
            .once('error', (err) => {
              errored = true;
              reject(err);
            })
            .once('end', () => {
              if (errored) {
                return;
              }
              const uploadedBytes = chunks.reduce((acumm, chunk) => acumm + chunk.length, 0);

              params.progressCallback(1, uploadedBytes, uploadedBytes);
              resolve(new Blob(chunks, { type: 'application/octet-stream' }));
            });
        })
        .catch(reject);
    });

    return [promise, actionState];
  }

  doUpload(bucketId: string, params: IUploadParams): [Promise<string>, Abortable | undefined] {
    const file: File = params.filecontent;
    const eventEmitter = new EventEmitter();

    let aborted = false;
    let uploadAbortable: Abortable;

    let frameId: string;
    let iv = Buffer.alloc(0);
    let index = Buffer.alloc(0);
    let encryptionKey = Buffer.alloc(0);
    let shardMeta: ShardMeta;

    eventEmitter.once('abort', () => {
      aborted = true;
      uploadAbortable?.stop();
    });

    const uploadPromise = prepareUpload(bucketId, this.creds).then((frame) => {
      if (aborted) {
        throw new UploadAbortedError();
      }

      frameId = frame;
      console.log('Frame ID %s', frameId);

      index = randomBytes(32);
      iv = index.slice(0, 16);

      return generateFileKey(this.mnemonic, bucketId, index);
    }).then((key) => {
      if (aborted) {
        throw new UploadAbortedError();
      }

      encryptionKey = key;

      return calculateEncryptedFileHash(file, createAES256Cipher(encryptionKey, iv));
    }).then((fileHash) => {
      if (aborted) {
        throw new UploadAbortedError();
      }

      shardMeta = {
        hash: fileHash,
        index: 0,
        parity: false,
        size: params.filesize,
      };

      console.log('PARTIAL SHARD META', JSON.stringify(shardMeta));

      return getUploadUrl(frameId, shardMeta, this.creds);
    }).then((uploadUrl) => {
      if (aborted) {
        throw new UploadAbortedError();
      }

      const [uploadPromise, uploadFileAbortable] = uploadFile(
        file,
        createAES256Cipher(encryptionKey, iv),
        uploadUrl
      );
      uploadAbortable = uploadFileAbortable;

      return uploadPromise;
    }).then(() => {
      if (aborted) {
        throw new UploadAbortedError();
      }

      return encryptFilename(this.mnemonic, bucketId, v4());
    }).then((encryptedFilename) => {
      if (aborted) {
        throw new UploadAbortedError();
      }

      return finishUpload(
        this.mnemonic,
        bucketId,
        frameId,
        encryptedFilename,
        index,
        encryptionKey,
        shardMeta,
        this.creds
      );
    });

    return [uploadPromise, {
      stop: () => {
        eventEmitter.emit('abort');
      }
    }];
  }

  getFileDownloadStream(
    bucketId: string,
    fileId: string,
    params: IDownloadParams,
  ): [Promise<Readable>, ActionState | undefined] {
    let actionState: ActionState | undefined;

    if (!bucketId) {
      throw new Error('Bucket id not provided');
    }

    if (!fileId) {
      throw new Error('File id not provided');
    }

    const promise = new Promise<Readable>((resolve, reject) => {
      actionState = this.environment.download(
        bucketId,
        fileId,
        {
          ...params,
          finishedCallback: (err, downloadStream) => {
            if (err) {
              //STATUS: ERROR DOWNLOAD FILE
              return reject(err);
            }

            if (!downloadStream) {
              return reject(Error('Download stream is empty'));
            }

            resolve(downloadStream);
          },
        },
        {
          label: 'Dynamic',
          params: {
            useProxy: process.env.REACT_APP_DONT_USE_PROXY !== 'true',
            concurrency: 6,
          },
        },
      );
    });

    return [promise, actionState];
  }

  getFileInfo(bucketId: string, fileId: string): Promise<FileInfo> {
    return this.environment.getFileInfo(bucketId, fileId);
  }

  createFileToken(bucketId: string, fileId: string, operation: 'PULL' | 'PUSH'): Promise<string> {
    return this.environment.createFileToken(bucketId, fileId, operation);
  }
}

/**
 * Returns required config to upload files to the Internxt Network
 * @param isTeam Flag to indicate if is a team or not
 * @returns
 */
export function getEnvironmentConfig(isTeam?: boolean): EnvironmentConfig {
  if (isTeam) {
    const team = localStorageService.getTeams() as TeamsSettings;

    return {
      bridgeUser: team.bridge_user,
      bridgePass: team.bridge_password,
      encryptionKey: team.bridge_mnemonic,
      bucketId: team.bucket,
      useProxy: process.env.REACT_APP_DONT_USE_PROXY !== 'true',
    };
  }

  const user = localStorageService.getUser() as UserSettings;

  return {
    bridgeUser: user.bridgeUser,
    bridgePass: user.userId,
    encryptionKey: user.mnemonic,
    bucketId: user.bucket,
    useProxy: process.env.REACT_APP_DONT_USE_PROXY !== 'true',
  };
}

export const generateFileKey = Environment.utils.generateFileKey;
