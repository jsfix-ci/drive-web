import { ShareLink } from '@internxt/sdk/dist/drive/shareV2/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import storageSelectors from '../../store/slices/storage/storage.selectors';

const sharedItemActions = (share: ShareLink) => {
  const isItemSelected = useAppSelector(storageSelectors.isItemSelected);
  return {};
};

export default sharedItemActions;
