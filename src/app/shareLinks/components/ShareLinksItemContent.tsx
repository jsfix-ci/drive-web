import { Component, ReactNode } from 'react';
import { Dropdown } from 'react-bootstrap';
import UilEllipsisH from '@iconscout/react-unicons/icons/uil-ellipsis-h';
import dateService from '../../core/services/date.service';

interface ItemContent {
    item: any;
}
class ShareLinksItemContent extends Component<ItemContent> {
    render(): ReactNode {
        const {item} = this.props;
        return (
            <div>
                <div className="box-content flex w-0.5/12 items-center justify-center px-3">
                {/* <ItemIconComponent className="h-full" /> */}
                </div>
                <p className="flex-grow pr-3">{item.item.name}</p>
                <div className="hidden w-2/12 items-center lg:flex"></div>
                <div className="flex w-2/12 items-center">
                {item.timesValid ? item.views + '/' + item.timesValid : item.views} views
                </div>
                <div className="hidden w-3/12 items-center lg:flex">
                    {dateService.format(item.createdAt, 'DD MMMM YYYY. HH:mm')}
                </div>
                <div className="flex w-1/12 items-center rounded-tr-4px">
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic" className="file-list-item-actions-button">
                        <UilEllipsisH className="h-full w-full" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    {/* <SharedDropdownActions
                        onCopyLinkButtonClicked={onCopyLinkButtonClicked}
                        onLinkSettingsButtonClicked={onLinkSettingsButtonClicked}
                        onDeleteButtonClicked={onDeleteButtonClicked}
                    /> */}
                    </Dropdown.Menu>
                </Dropdown>
                </div>
            </div>
        );
    }
}

export default ShareLinksItemContent;