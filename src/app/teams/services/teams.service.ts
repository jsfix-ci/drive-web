import envService from '../../core/services/env.service';
import httpService from '../../core/services/http.service';
import localStorageService from '../../core/services/local-storage.service';
import { Workspace } from '../../core/types';
import { decryptPGP, encryptPGPInvitations } from '../../crypto/services/utilspgp';
import { InfoInvitationsMembers, TeamsSettings } from '../types';

export async function getTeamsInfo(): Promise<{ userTeam: TeamsSettings; tokenTeams: string }> {
  return fetch(`${process.env.REACT_APP_API_URL}/api/teams/info`, {
    method: 'get',
    headers: httpService.getHeaders(true, false, false),
  })
    .then((res) => {
      return res.json();
    })
    .catch(() => {
      throw new Error('Can not get info team');
    });
}

export async function getKeys(mail: string): Promise<{ publicKey: string }> {
  return fetch(`${process.env.REACT_APP_API_URL}/api/user/keys/${mail}`, {
    method: 'GET',
    headers: httpService.getHeaders(true, false),
  }).then(async (res) => {
    if (res.status === 400) {
      const res1 = await res.json();

      throw res1;
    }

    if (res.status !== 200) {
      throw new Error('This user cannot be invited');
    }
    return res.json();
  });
}

export async function storeTeamsInfo(): Promise<void> {
  try {
    const { userTeam, tokenTeams } = await getTeamsInfo();

    if (userTeam && tokenTeams) {
      const mnemonic = await decryptPGP(Buffer.from(userTeam.bridgeMnemonic, 'base64').toString());

      userTeam.bridgeMnemonic = mnemonic.data;

      localStorageService.set('xTeam', JSON.stringify(userTeam));
      localStorageService.set('xTokenTeam', tokenTeams);
    } else {
      localStorageService.removeItem('xTeam');
      localStorageService.removeItem('xTokenTeam');
    }
  } catch (err: unknown) {
    throw new Error('Can not get info team');
  }
}

export function getMembers(): Promise<InfoInvitationsMembers[]> {
  return fetch(`${process.env.REACT_APP_API_URL}/api/teams/members`, {
    method: 'get',
    headers: httpService.getHeaders(true, false),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      throw err;
    });
}

export function removeMember(item: InfoInvitationsMembers): Promise<void> {
  return httpService.delete(`${process.env.REACT_APP_API_URL}/api/teams/member`, {
    authWorkspace: Workspace.Individuals,
    headers: httpService.getHeaders(true, false),
    data: JSON.stringify({ user: item.user })
  });
}

export function removeInvitation(invitationId: string): Promise<void> {
  return httpService.delete(`${process.env.REACT_APP_API_URL}/api/teams/invitation/${invitationId}`, {
    authWorkspace: Workspace.Individuals,
    headers: httpService.getHeaders(true, false)
  });
}

export async function sendEmailTeamsMember(mail: string): Promise<void> {
  const { publicKey } = await getKeys(mail);
  const xTeam = localStorageService.getTeams() as TeamsSettings;

  const bridgePass = xTeam.bridgePassword;
  const mnemonicTeam = xTeam.bridgeMnemonic;

  const EncryptMnemonicTeam = await encryptPGPInvitations(mnemonicTeam, publicKey);

  const base64Mnemonic = Buffer.from(EncryptMnemonicTeam.data).toString('base64');
  const bridgeuser = xTeam.bridgeUser;

  await fetchInvitation(mail, bridgePass, base64Mnemonic, bridgeuser);
}

const fetchInvitation = (email: string, bridgePass: string, mnemonicTeam: string, bridgeuser: string) => {
  return httpService.post<{
    email: string
    bridgePass: string
    mnemonicTeam: string
    bridgeuser: string
  }, any>(`${process.env.REACT_APP_API_URL}/api/teams/team/invitations`, {
    email,
    bridgePass,
    mnemonicTeam,
    bridgeuser
  }, {
    headers: httpService.getHeaders(true, false, true)
  });
};

function getTeamInfoStripeSuccess() {
  return httpService.get<TeamsSettings>('/api/teams/team/info', { authWorkspace: Workspace.Individuals });
}

export async function checkSessionStripe(
  sessionId: string,
): Promise<void | { userTeams: TeamsSettings; tokenTeams: string }> {
  const userTeam = await getTeamInfoStripeSuccess();
  const mnemonic = await decryptPGP(Buffer.from(userTeam.bridgeMnemonic, 'base64').toString());

  return httpService
    .post<{ checkoutSessionId: string; test: boolean; mnemonic: string }, void>(
      '/api/teams/checkout/session',
      {
        checkoutSessionId: sessionId,
        test: !envService.isProduction(),
        mnemonic: mnemonic.data,
      },
      { authWorkspace: Workspace.Individuals },
    )
    .then(() => storeTeamsInfo());
}

const teamsService = {
  getTeamsInfo,
  getKeys,
  storeTeamsInfo,
  sendEmailTeamsMember,
  checkSessionStripe,
};

export default teamsService;
