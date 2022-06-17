import ListItem from './ListItem';
import { useAppDispatch } from '../../../store/hooks';
import { backupsThunks } from '../../../store/slices/backups';
import i18n from '../../../i18n/services/i18n.service';
import DriveListItemSkeleton from '../../../drive/components/DriveListItemSkeleton/DriveListItemSkeleton';

import Breadcrumbs, { BreadcrumbItemData } from 'app/shared/components/Breadcrumbs/Breadcrumbs';
import { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'app/store';
// interface Props {
//   items: Array<any>;
//   isLoading: boolean;
// }

// const ListHead = (props: Props): JSX.Element => {
//   const dispatch = useAppDispatch();
//   const { isLoading } = props;
//   const onDeleteItemClicked = async (item) => {
//     // dispatch(backupsThunks.deleteBackupThunk(backup));
//   };
//   const getItemsList = () =>
//     props.items.map((item) => (
//       <ListItem key={item.id} item={item} onDeleteItemClicked={onDeleteItemClicked} />
//     ));
//   const getLoadingSkeleton = () => {
//     return Array(10)
//       .fill(0)
//       .map((n, i) => <DriveListItemSkeleton key={i} />);
//   };

//   return (
//     <div className="flex justify-between pb-4">
//               <div className={'flex items-center text-lg'}>{title}</div>

//               <div className="flex">
//                 {/* {this.hasAnyItemSelected ? (
//                   <BaseButton className="primary mr-1.5 flex items-center" onClick={this.onDownloadButtonClicked}>
//                     <UilCloudDownload className="mr-1.5 h-5" />
//                     <span>{i18n.get('actions.download')}</span>
//                   </BaseButton>
//                 ) : (
//                   <BaseButton className="primary mr-1.5 flex items-center" onClick={this.onUploadButtonClicked}>
//                     <UilCloudUpload className="mr-1.5 h-5" />
//                     <span>{i18n.get('actions.upload')}</span>
//                   </BaseButton>
//                 )}
//                 {!this.hasAnyItemSelected ? (
//                   <BaseButton className="tertiary square w-8" onClick={this.onCreateFolderButtonClicked}>
//                     <UilFolderPlus />
//                   </BaseButton>
//                 ) : null}
//                 {this.hasAnyItemSelected ? (
//                   <BaseButton className="tertiary square w-8" onClick={this.onBulkDeleteButtonClicked}>
//                     <UilTrashAlt />
//                   </BaseButton>
//                 ) : null}
//                 <BaseButton className="tertiary square ml-1.5 w-8" onClick={this.onViewModeButtonClicked}>
//                   {viewModesIcons[viewMode]}
//                 </BaseButton> */}
//               </div>
//             </div>
//   );
// };

// export default List;

interface ListHeadProps {
    breadcrumbs: Array<BreadcrumbItemData> | string;
    titleClassName?: string;
}

class ListHead extends Component<ListHeadProps> {
    render(): ReactNode {
        const { titleClassName, breadcrumbs } = this.props;

        return (
            <div className="flex justify-between pb-4">
                <div className={`flex items-center text-lg ${titleClassName || ''}`}>
                { Array.isArray(breadcrumbs) ? <Breadcrumbs items={breadcrumbs} />: breadcrumbs }
                </div>

                <div className="flex">
                {/* {this.hasAnyItemSelected ? (
                    <BaseButton className="primary mr-1.5 flex items-center" onClick={this.onDownloadButtonClicked}>
                    <UilCloudDownload className="mr-1.5 h-5" />
                    <span>{i18n.get('actions.download')}</span>
                    </BaseButton>
                ) : (
                    <BaseButton className="primary mr-1.5 flex items-center" onClick={this.onUploadButtonClicked}>
                    <UilCloudUpload className="mr-1.5 h-5" />
                    <span>{i18n.get('actions.upload')}</span>
                    </BaseButton>
                )}
                {!this.hasAnyItemSelected ? (
                    <BaseButton className="tertiary square w-8" onClick={this.onCreateFolderButtonClicked}>
                    <UilFolderPlus />
                    </BaseButton>
                ) : null}
                {this.hasAnyItemSelected ? (
                    <BaseButton className="tertiary square w-8" onClick={this.onBulkDeleteButtonClicked}>
                    <UilTrashAlt />
                    </BaseButton>
                ) : null}
                <BaseButton className="tertiary square ml-1.5 w-8" onClick={this.onViewModeButtonClicked}>
                    {viewModesIcons[viewMode]}
                </BaseButton> */}
                </div>
            </div>
          );
    }
}

export default ListHead;
