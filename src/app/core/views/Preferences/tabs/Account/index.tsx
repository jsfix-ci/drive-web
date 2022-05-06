import AccountDetails from './AccountDetails';
import DeleteAccount from './DeleteAccount';
import InviteAFriend from './InviteAFriend';
import Usage from './Usage';
import UserHeader from './UserHeader';

export default function AccountTab({ isHidden }: { isHidden: boolean }): JSX.Element {
  return (
    <div className={`h-full w-full ${isHidden ? 'hidden' : ''}`}>
      <UserHeader />
      <div className="mt-8 grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fill,24rem)' }}>
        <Usage />
        <AccountDetails />
        <InviteAFriend />
        <DeleteAccount />
      </div>
    </div>
  );
}
