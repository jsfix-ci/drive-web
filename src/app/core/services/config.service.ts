import APP_CONFIG from '../config/app.json';
import { DatabaseProvider } from '../../database/services/database.service';
import { AppConfig, AppViewConfig, AppViewLayout } from '../types';
import { DownloadFolderMethod } from '../../drive/types';

export function getAppConfig(): AppConfig {
  const config: AppConfig = {
    ...APP_CONFIG,
    ...{
      fileExplorer: {
        ...APP_CONFIG.fileExplorer,
        download: {
          ...APP_CONFIG.fileExplorer.download,
          folder: {
            ...APP_CONFIG.fileExplorer.download.folder,
            method: APP_CONFIG.fileExplorer.download.folder.method as DownloadFolderMethod,
          },
        },
      },
      views: APP_CONFIG.views.map((v) => ({ ...v, layout: v.layout as AppViewLayout })),
      database: { ...APP_CONFIG.database, provider: APP_CONFIG.database.provider as DatabaseProvider },
    },
  };

  return config;
}

export function getViewConfig(filter: Partial<AppViewConfig>): AppViewConfig | undefined {
  const config = getAppConfig();

  return config.views.find((v) =>
    Object.keys(filter).reduce((t: boolean, key: string) => {
      return v[key] === filter[key] && t;
    }, true),
  );
}

const configService = {
  getAppConfig,
  getViewConfig,
};

export default configService;
