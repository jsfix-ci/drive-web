import React, { MouseEvent, ReactNode } from 'react';
import UilCloudDownload from '@iconscout/react-unicons/icons/uil-cloud-download';
import UilFileInfoAlt from '@iconscout/react-unicons/icons/uil-file-info-alt';
import UilTrashAlt from '@iconscout/react-unicons/icons/uil-trash-alt';
import Dropdown from 'react-bootstrap/Dropdown';
import { DriveItemAction } from '../../../drive/components/DriveExplorer/DriveExplorerItem';

interface SharedDropdownActionsProps {
  title?: string;
  hiddenActions?: DriveItemAction[];
  onCopyLinkButtonClicked: (e: MouseEvent) => void;
  onLinkSettingsButtonClicked: (e: MouseEvent) => void;
  onDeleteButtonClicked: (e: MouseEvent) => void;
}

class SharedDropdownActions extends React.Component<SharedDropdownActionsProps> {
  constructor(props: SharedDropdownActionsProps) {
    super(props);
  }

  render(): ReactNode {
    const { title } = this.props;
    const hiddenActions = this.props.hiddenActions || [];

    return (
      <div>
        {title ? <span className="mb-1 text-supporting-2">{title}</span> : null}

        {!hiddenActions.includes(DriveItemAction.Download) ? (
          <Dropdown.Item id="download" onClick={this.props.onCopyLinkButtonClicked}>
            <UilCloudDownload className="mr-1 h-5 text-blue-60" />
            <span>Copy link</span>
          </Dropdown.Item>
        ) : null}
        {!hiddenActions.includes(DriveItemAction.Info) ? (
          <Dropdown.Item id="info" onClick={this.props.onLinkSettingsButtonClicked}>
            <UilFileInfoAlt className="mr-1 h-5 text-blue-60" />
            <span>Link settings</span>
          </Dropdown.Item>
        ) : null}
        <hr className="my-1.5 text-neutral-30"></hr>
        {!hiddenActions.includes(DriveItemAction.Delete) ? (
          <Dropdown.Item id="info" onClick={this.props.onDeleteButtonClicked}>
            <UilTrashAlt className="mr-1 h-5 text-red-60" />
            <span className="text-red-60">Delete link</span>
          </Dropdown.Item>
        ) : null}
      </div>
    );
  }
}

export default SharedDropdownActions;
