import { AccountModel } from '@/domain/models/account';

export type SpotifyLoadUserParams = {
  accessToken: string;
  refreshToken: string;
  redirectUri: string;
};

export interface SpotifyLoadUser {
  load: (params: SpotifyLoadUserParams) => Promise<AccountModel>;
}
