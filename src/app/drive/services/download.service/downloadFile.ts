import streamSaver from 'streamsaver';

import analyticsService from 'app/analytics/services/analytics.service';
import localStorageService from 'app/core/services/local-storage.service';
import { DriveFileData } from '../../types';
import downloadFileFromBlob from './downloadFileFromBlob';
import fetchFileStream from './fetchFileStream';
import { loadWritableStreamPonyfill } from 'app/network/download';

interface BlobWritable {
  getWriter: () => {
    abort: () => Promise<void>;
    close: () => Promise<void>;
    closed: Promise<undefined>;
    desiredSize: number | null;
    ready: Promise<undefined>;
    releaseLock: () => void;
    write: (chunk: Uint8Array) => Promise<void>;
  };
  locked: boolean;
  abort: () => Promise<void>;
  close: () => Promise<void>;
}

function getBlobWritable(filename: string, onClose: (result: Blob) => void): BlobWritable {
  let blobParts: Uint8Array[] = [];

  return {
    getWriter: () => {
      return {
        abort: async () => {
          blobParts = [];
        },
        close: async () => {
          onClose(new File(blobParts, filename));
        },
        closed: Promise.resolve(undefined),
        desiredSize: 3 * 1024 * 1024,
        ready: Promise.resolve(undefined),
        releaseLock: () => {
          // no op
        },
        write: async (chunk) => {
          blobParts.push(chunk);
        },
      };
    },
    locked: false,
    abort: async () => {
      blobParts = [];
    },
    close: async () => {
      onClose(new File(blobParts, filename));
    },
  };
}

async function pipe(readable: ReadableStream, writable: BlobWritable): Promise<void> {
  const reader = readable.getReader();
  const writer = writable.getWriter();

  let done = false;

  while (!done) {
    const status = await reader.read();

    if (!status.done) {
      await writer.write(status.value);
    }

    done = status.done;
  }

  await reader.closed;
  await writer.close();
}

export default async function downloadFile(
  itemData: DriveFileData,
  isTeam: boolean,
  updateProgressCallback: (progress: number) => void,
  abortController?: AbortController,
): Promise<void> {
  const userEmail: string = localStorageService.getUser()?.email || '';
  const fileId = itemData.fileId;
  const completeFilename = itemData.type ? `${itemData.name}.${itemData.type}` : `${itemData.name}`;
  const isBrave = !!(navigator.brave && (await navigator.brave.isBrave()));
  const isCypress = window['Cypress'] !== undefined;

  const writeToFsIsSupported = 'showSaveFilePicker' in window;
  const writableIsSupported = 'WritableStream' in window && streamSaver.WritableStream;

  let support: DownloadSupport;

  if (isCypress) {
    support = DownloadSupport.PatchedStreamApi;
  } else if (isBrave) {
    support = DownloadSupport.Blob;
  } else if (writeToFsIsSupported) {
    support = DownloadSupport.StreamApi;
  } else if (writableIsSupported) {
    support = DownloadSupport.PartialStreamApi;
  } else {
    support = DownloadSupport.PatchedStreamApi;
  }

  const fileStreamPromise = fetchFileStream(
    { ...itemData, bucketId: itemData.bucket },
    { isTeam, updateProgressCallback, abortController },
  );

  analyticsService.trackFileDownloadStart({
    fileId: itemData.id,
    folderId: itemData.folderId,
    size: Number(itemData.size),
    type: itemData.type,
  });

  await downloadToFs(completeFilename, fileStreamPromise, support, abortController).catch((err) => {
    const errMessage = err instanceof Error ? err.message : (err as string);

    analyticsService.trackFileDownloadError({
      fileId: itemData.id,
      folderId: itemData.folderId,
      size: Number(itemData.size),
      type: itemData.type,
    });

    throw new Error(errMessage);
  });

  analyticsService.trackFileDownloadCompleted({
    fileId: itemData.id,
    folderId: itemData.folderId,
    size: Number(itemData.size),
    type: itemData.type,
  });
}

async function downloadFileAsBlob(filename: string, source: ReadableStream): Promise<void> {
  const destination: BlobWritable = getBlobWritable(filename, (blob) => {
    downloadFileFromBlob(blob, filename);
  });

  await pipe(source, destination);
}

function downloadFileUsingStreamApi(
  source: ReadableStream,
  destination: WritableStream,
  abortController?: AbortController,
): Promise<void> {
  return (
    (source.pipeTo && source.pipeTo(destination, { signal: abortController?.signal })) || pipe(source, destination)
  );
}

enum DownloadSupport {
  StreamApi = 'StreamApi',
  PartialStreamApi = 'PartialStreamApi',
  PatchedStreamApi = 'PartialStreamApi',
  Blob = 'Blob',
}

async function downloadToFs(
  filename: string,
  source: Promise<ReadableStream>,
  supports: DownloadSupport,
  abortController?: AbortController,
): Promise<void> {
  switch (supports) {
    case DownloadSupport.StreamApi:
      // eslint-disable-next-line no-case-declarations
      const fsHandle = await window.showSaveFilePicker({ suggestedName: filename });
      // eslint-disable-next-line no-case-declarations
      const destination = await fsHandle.createWritable({ keepExistingData: false });

      return downloadFileUsingStreamApi(await source, destination, abortController);
    case DownloadSupport.PatchedStreamApi:
      await loadWritableStreamPonyfill();

      streamSaver.WritableStream = window.WritableStream;

      return downloadFileUsingStreamApi(await source, streamSaver.createWriteStream(filename), abortController);
    case DownloadSupport.PartialStreamApi:
      return downloadFileUsingStreamApi(await source, streamSaver.createWriteStream(filename), abortController);

    default:
      return downloadFileAsBlob(filename, await source);
  }
}
