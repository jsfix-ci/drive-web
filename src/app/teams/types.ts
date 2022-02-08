export interface TeamsSettings {
  isAdmin: boolean;
  bucket: string;
  bridgeMnemonic: string;
  bridgePassword: string;
  bridgeUser: string;
  root_folder_id: number;
  totalMembers: number;
}

export interface InfoInvitationsMembers {
  isMember: boolean;
  isInvitation: boolean;
  user: string;
}
