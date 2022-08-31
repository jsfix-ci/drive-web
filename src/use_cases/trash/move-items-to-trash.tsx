import { SdkFactory } from '../../app/core/factory/sdk';
import { storageActions } from '../../app/store/slices/storage';
import { store } from '../../app/store';
import notificationsService, { ToastType } from '../../app/notifications/services/notifications.service';

const MoveItemsToTrash = async (itemsToTrash) => {
  const items = itemsToTrash.map((item) => {
    return {
      id: item.isFolder ? item.id : item.fileId,
      type: item.isFolder ? 'folder' : 'file',
    };
  });
  const trashClient = await SdkFactory.getInstance().createTrashClient();
  await trashClient.addItemsToTrash({ items });

  store.dispatch(storageActions.popItems({ updateRecents: true, items: itemsToTrash }));
  store.dispatch(storageActions.clearSelectedItems());

  notificationsService.show({
    type: ToastType.Success,
    text: `${itemsToTrash.length > 1 ? itemsToTrash.length : ''} Item${
      itemsToTrash.length > 1 ? 's' : ''
    } moved to trash`,
    action: {
      text: 'Undo',
      onClick: () => {
        console.log('UNDO');
      },
    },
  });
};

export default MoveItemsToTrash;
