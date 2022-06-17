import ListItem from './ListItem';
import { useAppDispatch } from '../../../store/hooks';
import { backupsThunks } from '../../../store/slices/backups';
import i18n from '../../../i18n/services/i18n.service';
import DriveListItemSkeleton from '../../../drive/components/DriveListItemSkeleton/DriveListItemSkeleton';
import { Component, ReactNode } from 'react';

interface ListProps {
  items: Array<any>;
  isLoading: boolean;
  tableHead: any;
  
}
class List extends Component<ListProps> {
  itemsSelected: Array<any> = [];
  isItemSelected = (item) => {
    return this.itemsSelected.some((i: any) => item.id === i.id);
  }
  selectItem = (item: any) => {
    const itemIndex = this.itemsSelected.findIndex((i: any) => item.id === i.id);
    if(itemIndex < 0) {
      this.itemsSelected.push(item);
    } else {
      this.itemsSelected.slice(itemIndex, 1);
    }
  }
  selectAllItems = () => {
    if(!this.isAllSelected) {
      console.log('ok');
      this.props.items.forEach((item) => {
        this.itemsSelected.push(item);
      });
    } else {
      this.itemsSelected = [];
    }
    
  }
  get isAllSelected(): boolean {
    const { items } = this.props;

    return this.itemsSelected.length === items.length && items.length > 0;
  }
  getLoadingSkeleton = () => {
    return Array(10)
          .fill(0)
          .map((n, i) => <DriveListItemSkeleton key={i} />);
  };
  render() : ReactNode {
    const { isLoading, items, tableHead } = this.props;
    return (
      <div className="flex h-1 flex-grow flex-col bg-white">
        <div className="files-list flex border-b border-neutral-30 bg-white py-3 text-sm font-semibold text-neutral-500">
          <div className="w-0.5/12 pl-3 flex items-center justify-start box-content">
            <input
              disabled={items.length === 0}
              readOnly
              checked={this.isAllSelected}
              onClick={this.selectAllItems}
              type="checkbox"
              className="pointer-events-auto"
            />
          </div>
          <div className="w-full">
            {tableHead}
          </div>
        </div>
        
        <div className="h-full overflow-y-auto">
          {
          isLoading ? 
            this.getLoadingSkeleton() : 
          items.length > 0 ?
            items.map((item) => (
              <ListItem item={item} isItemSelected={this.isItemSelected} selectItem={this.selectItem} />
            )) :
            null
          }
        </div>
      </div>
    );
  }
}

export default List;
