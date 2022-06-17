import { Component, ReactNode, useEffect, useState } from 'react';
import UilHdd from '@iconscout/react-unicons/icons/uil-hdd';

import i18n from 'app/i18n/services/i18n.service';
import { ShareLink } from '../../types';
import List from '../../../shared/components/List/List';
import { sharedActions, sharedThunks } from 'app/store/slices/shareLinks';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { AppDispatch, RootState } from 'app/store';
import { connect } from 'react-redux';
import ShareLinksItemContent from 'app/shareLinks/components/ShareLinksItemContent';
import ListHead from 'app/shared/components/List/ListHead';
import { items } from '@internxt/lib';
import { BreadcrumbItemData } from 'app/shared/components/Breadcrumbs/Breadcrumbs';

// export default function ShareLinkView(): JSX.Element {
//   const dispatch = useAppDispatch();
//   const isLoadingShareds = useAppSelector((state) => state.shared.isLoadingShareds);
//   const sharedLinks = useAppSelector((state) => state.shared.sharedLinks);
//   const pagination = useAppSelector((state) => state.shared.pagination);

//   useEffect(() => {
//     dispatch(sharedThunks.fetchSharedLinksThunk());
//   }, []);

//   return (
//     <div className="mb-5 flex flex-grow flex-col px-8 pt-6">
//       <div className="flex items-baseline pb-4">
//         <p className="px-3 py-1 text-lg"> {i18n.get('shared.sharedLinks')}</p>
//       </div>
//       <List isLoading={isLoadingShareds} items={sharedLinks} />
//     </div>
//   );
// }
export interface TableViewProps {
  items: any;
  namePath: any;
  isLoading: boolean;
  dispatch: AppDispatch;
}

class ShareLinkView extends Component<TableViewProps> {
  getBreadCrumbs = (): BreadcrumbItemData[] | string => {
    return i18n.get('shareLinks.sharedLinks');
  }
  getTableHead = () => {
    return (
      <div className="flex">
        <div className="flex flex-grow items-center px-3">{i18n.get('shareLinks.list.columns.name')}</div>
        <div className="hidden w-2/12 items-center xl:flex"></div>
        <div className="flex w-2/12 items-center">{i18n.get('shareLinks.list.columns.shared')}</div>
        <div className="hidden w-3/12 items-center lg:flex">{i18n.get('shareLinks.list.columns.created')}</div>
        <div className="flex w-1/12 items-center rounded-tr-4px"></div>
      </div>
    );

  }
  getItems = () => {
    this.props.items.map((item) => (
      <ShareLinksItemContent item={item}></ShareLinksItemContent>
    ));
  }
  render(): ReactNode {
    const { items, isLoading } = this.props;
    return (
      <div className="flex h-full flex-grow flex-col px-8" data-test="drag-and-drop-area">
        <div className="flex h-full w-full max-w-full flex-grow">
          <div className="flex w-1 flex-grow flex-col pt-6">
            <ListHead breadcrumbs={this.getBreadCrumbs()}/>
            <List isLoading={isLoading} items={items} tableHead={this.getTableHead()} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state: RootState) => {
  return { items: [], isLoading: false, namePath: '' };
})(ShareLinkView);
