import { Dropdown } from 'react-bootstrap';

import UilEllipsisH from '@iconscout/react-unicons/icons/uil-ellipsis-h';
import dateService from '../../../core/services/date.service';
// import { ReactComponent as BackupIcon } from '../../../../assets/icons/light/folder-backup.svg';
// import sizeService from '../../../drive/services/size.service';
import { useAppDispatch } from '../../../store/hooks';
// import { uiActions } from '../../../store/slices/ui';
import SharedDropdownActions from '../SharedDropdownActions/SharedDropdownActions';
import { Component, ReactNode } from 'react';
// import iconService from '../../../drive/services/icon.service';
// export default function ListItem({
//   item,
//   onDeleteItemClicked
// }: {
//   item,
//   onDeleteItemClicked?: (item) => void;
// }): JSX.Element {
//   const dispatch = useAppDispatch();

//   // const ItemIconComponent = iconService.getItemIcon(share.isFolder, share.item.type);

//   const onCopyLinkButtonClicked = () => null;
//   const onDeleteButtonClicked = () => onDeleteItemClicked(item);
//   const onLinkSettingsButtonClicked = (e: React.MouseEvent) => {
//     // const infoMenuFeatures = [
//     //   {
//     //     label: 'Device path',
//     //     value: backup.path,
//     //   },
//     //   {
//     //     label: 'Size',
//     //     value: sizeService.bytesToString(backup.size || 0, false),
//     //   },
//     //   {
//     //     label: 'Modified',
//     //     value: dateService.format(backup.updatedAt, 'DD MMMM YYYY'),
//     //   },
//     //   {
//     //     label: 'Created',
//     //     value: dateService.format(backup.createdAt, 'DD MMMM YYYY'),
//     //   },
//     // ];

//     // dispatch(
//     //   uiActions.setFileInfoItem({
//     //     id: `backup-item-${backup.id}`,
//     //     icon: BackupIcon,
//     //     title: backup.name,
//     //     features: infoMenuFeatures,
//     //   }),
//     // );
//     // dispatch(uiActions.setIsDriveItemInfoMenuOpen(true));

//     e.stopPropagation();
//   };

//   return (
//     <div className="flex items-center border-b border-neutral-30 py-3.5 text-gray-40 hover:bg-blue-20">
//       <div className="box-content flex w-0.5/12 items-center justify-center px-3">
//         {/* <ItemIconComponent className="h-full" /> */}
//       </div>
//       <p className="flex-grow pr-3">{item.item.name}</p>
//       <div className="hidden w-2/12 items-center lg:flex"></div>
//       <div className="flex w-2/12 items-center">
//         {item.timesValid ? item.views + '/' + item.timesValid : item.views} views
//       </div>
//       <div className="hidden w-3/12 items-center lg:flex">
//         {dateService.format(item.createdAt, 'DD MMMM YYYY. HH:mm')}
//       </div>
//       <div className="flex w-1/12 items-center rounded-tr-4px">
//         <Dropdown>
//           <Dropdown.Toggle variant="success" id="dropdown-basic" className="file-list-item-actions-button">
//             <UilEllipsisH className="h-full w-full" />
//           </Dropdown.Toggle>
//           <Dropdown.Menu>
//             <SharedDropdownActions
//               onCopyLinkButtonClicked={onCopyLinkButtonClicked}
//               onLinkSettingsButtonClicked={onLinkSettingsButtonClicked}
//               onDeleteButtonClicked={onDeleteButtonClicked}
//             />
//           </Dropdown.Menu>
//         </Dropdown>
//       </div>
//     </div>
//   );
// }

export interface ListItemProps {
  item: JSX.Element;
  isItemSelected: any;
  selectItem: any;
}
class ListItem extends Component<ListItemProps> {
  onChangeSelect(item) {
    this.props.selectItem(item);
  }
  render(): ReactNode {
    const { item, isItemSelected } = this.props;
    return (
      <div className="flex items-center border-b border-neutral-30 py-3.5 text-gray-40 hover:bg-blue-20">
        {/* SELECTION */}
        <div className="w-0.5/12 pl-3 flex items-center justify-start box-content">
          <input
            onClick={(e) => e.stopPropagation()}
            type="checkbox"
            checked={isItemSelected(item)}
            onChange={this.onChangeSelect}
          />
        </div>
        {item}
      </div>
    );
  }
}

export default ListItem;
