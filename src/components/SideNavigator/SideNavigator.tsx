import React from 'react';

import SideNavigatorItem from './SideNavigatorItem/SideNavigatorItem';
import { ReactComponent as ReactLogo } from '../../assets/icons/internxt-long-logo.svg';

import './SideNavigator.scss';
import authService from '../../services/auth.service';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { UserSettings } from '../../models/interfaces';
import { getIcon } from '../../services/icon.service';

interface SideNavigatorProps {
  user: UserSettings;
}

interface SideNavigatorState {
  collapsed: boolean;
}

class SideNavigator extends React.Component<SideNavigatorProps, SideNavigatorState> {
  constructor(props: SideNavigatorProps) {
    super(props);

    this.state = {
      collapsed: false
    };

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.onUpgradeButtonClicked = this.onUpgradeButtonClicked.bind(this);
  }

  componentDidMount(): void { }

  onUpgradeButtonClicked() {
    console.log('Upgrade button clicked!');
  }

  toggleCollapsed(): void {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render(): JSX.Element {
    const { user } = this.props;
    const { collapsed } = this.state;

    return (
      <div className={`${collapsed ? 'collapsed' : ''} side-navigator bg-l-neutral-20 flex flex-col justify-between`}>

        {/* LOGO & ITEMS */}
        <div>
          <button className="collapse-button cursor-pointer flex items-center z-40 absolute transform"
            onClick={this.toggleCollapsed}
          >
            <img src={getIcon('nextPage')} alt="" />
          </button>

          <div>
            <div className="py-3 mb-2">
              {collapsed ?
                <img className='opacity-0 w-6 long-logo' src={getIcon('internxtShortLogo')} alt="" /> :
                <div className="w-28 h-auto flex items-center">
                  <ReactLogo className="long-logo w-full" />
                </div>
              }
            </div>

            <div className={`${!collapsed ? 'mb-10' : ''}`}>
              <span className='h-3 text-xs text-m-neutral-100 font-semibold mb-4'>{!collapsed && 'Storage'}</span>
              <SideNavigatorItem
                label='Drive'
                to="/app"
                icon={getIcon('folderWithCrossGray')}
                isOpen={!collapsed}
              />
              <SideNavigatorItem
                label='Recents'
                to="/app/recents"
                icon={getIcon('clockGray')}
                isOpen={!collapsed}
              />
            </div>

            <div>
              <span className='h-3 text-xs text-m-neutral-100 font-semibold mb-4'>{!collapsed && 'Configuration'}</span>
              <SideNavigatorItem
                label='Account'
                to="/account"
                icon={getIcon('accountGray')}
                isOpen={!collapsed}
              />
              <SideNavigatorItem label="App" icon={getIcon('desktop')} isOpen={!collapsed} />
              <SideNavigatorItem label='Support' icon={getIcon('supportGray')} isOpen={!collapsed} />
              <SideNavigatorItem label='Log out' icon={getIcon('logOutGray')} isOpen={!collapsed} onClick={authService.logOut} />
            </div>
          </div>
        </div>

        {/* UPGRADE */}
        { !collapsed ? (
          <div className="account-state-container w-full">
            <div className="bg-white w-full rounded-4px">
              <div className="px-4 py-2 text-xs border-b border-dashed border-l-neutral-40">
                Jhon Doe Young
              </div>
              <div className="px-4 pt-2 pb-2 flex flex-col justify-center">
                <span className="text-xs">{user.email}</span>
                <div className="w-full bg-blue-10 h-1 rounded-sm">
                  <div className="w-1/2 h-full bg-blue-60 rounded-sm"></div>
                </div>
                <span className="flex-grow mt-1 text-supporting-2 text-m-neutral-100">338.64 MB of 10 GB</span>
                <button className="secondary" onClick={this.onUpgradeButtonClicked}>Upgrade</button>
              </div>
            </div>
          </div>) :
          null
        }
      </div>
    );
  }
}

export default connect(
  (state: RootState) => ({
    user: state.user.user
  }))(SideNavigator);
