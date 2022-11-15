import BaseDialog from 'app/shared/components/BaseDialog/BaseDialog';
import { useState } from 'react';
import errorService from 'app/core/services/error.service';
import { uiActions } from 'app/store/slices/ui';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { RootState } from 'app/store';
import i18n from 'app/i18n/services/i18n.service';
import clearTrash from '../../../../use_cases/trash/clear-trash';
import Button from 'app/shared/components/Button/Button';
import analyticsService from 'app/analytics/services/analytics.service';
import { DriveItemData } from 'app/drive/types';
import { SdkFactory } from 'app/core/factory/sdk';
import _ from 'lodash';

interface ClearTrashDialogProps {
  onItemsDeleted?: () => void;
  items?: DriveItemData[];
}

const ClearTrashDialog = (props: ClearTrashDialogProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state: RootState) => state.ui.isClearTrashDialogOpen);

  const onClose = (): void => {
    dispatch(uiActions.setIsClearTrashDialogOpen(false));
  };

  const onAccept = async (): Promise<void> => {
    try {
      setIsLoading(true);
      clearTrash();

      props.onItemsDeleted && props.onItemsDeleted();

      setIsLoading(false);
      onClose();
      props.items?.map((item) => {
        getFolderSize(item.id).then((size) => {
          console.log(size);
        });
        if (item.isFolder === true) {
          window.rudderanalytics.track('Folder deleted', {
            size: 0,
          });
        } else {
          analyticsService.trackFileDeleted(item.size, item.type, item.id, item.parentId);
        }
      });
    } catch (err: unknown) {
      const castedError = errorService.castError(err);

      setIsLoading(false);

      console.log(castedError.message);
    }
  };

  async function getFolderSize(folderId) {
    let size = 0;
    const storageClient = SdkFactory.getInstance().createStorageClient();
    const [responsePromise] = storageClient.getFolderContent(folderId);
    const response = await responsePromise;
    const folders = response.children.map((folder) => ({ ...folder, isFolder: true }));
    const items = _.concat(folders as DriveItemData[], response.files as DriveItemData[]);
    console.log('Items in Folder ', items);
    items.map((item) => {
      size += item.size;
    });

    return size;
  }

  return (
    <BaseDialog
      isOpen={isOpen}
      title={i18n.get('drive.clearTrash.title')}
      panelClasses="w-96 rounded-2xl pt-20px"
      titleClasses="text-left px-5 text-2xl font-medium"
      onClose={onClose}
      closeClass={'hidden'}
    >
      <span className="mt-20px block w-full px-5 text-left text-base text-neutral-900">
        {i18n.get('drive.clearTrash.advice')}
      </span>

      <div className="my-20px flex justify-end bg-white">
        <Button disabled={isLoading} variant="secondary" onClick={onClose} className="mr-3">
          {i18n.get('actions.cancel')}
        </Button>
        <Button disabled={isLoading} variant="accent" className="mr-5" onClick={onAccept}>
          {isLoading ? i18n.get('drive.clearTrash.progress') : i18n.get('drive.clearTrash.accept')}
        </Button>
      </div>
    </BaseDialog>
  );
};

export default ClearTrashDialog;
