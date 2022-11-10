import { AccountModel } from '@/domain/models/account';

export type SpotifyRequestTokenParams = {
  code: string;
  state: string;
  redirectUri: string;
  encodedAuthorization: string;
};

export interface SpotifyRequestToken {
  request: (params: SpotifyRequestTokenParams) => Promise<AccountModel>;
}
