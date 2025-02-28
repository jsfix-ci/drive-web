import { items } from '@internxt/lib';

import { OrderDirection } from '../../core/types';
import { DriveItemData } from '../types';

const itemsListService = {
  pushItems: (itemsToPush: DriveItemData[], list: DriveItemData[]): DriveItemData[] => {
    const listCopy = [...list];

    listCopy.push(...itemsToPush);

    return listCopy;
  },
  sort(list: DriveItemData[], by: 'name' | 'type' | 'updatedAt' | 'size', direction: OrderDirection): void {
    const dirNumber = direction === OrderDirection.Desc ? 1 : -1;
    const sortFns: Record<string, (a: DriveItemData, b: DriveItemData) => number> = {
      name: (a, b) =>
        (items.getItemDisplayName(a).toLowerCase() < items.getItemDisplayName(b).toLowerCase() ? 1 : -1) * dirNumber,
      type: (a, b) => (a.type < b.type ? 1 : -1) * dirNumber,
      updatedAt: (a, b) => (a.updatedAt < b.updatedAt ? 1 : -1) * dirNumber,
      size: (a, b) => (a.size < b.size ? 1 : -1) * dirNumber,
    };

    list.sort(sortFns[by]);
  },
};

export default itemsListService;
