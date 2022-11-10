import { faker } from '@faker-js/faker';
import { SpotifyRequestToken, SpotifyRequestTokenParams } from '@/domain/usecases/spotify/spotify-request-token';
import { SpotifyAccessModel } from '../models/spotify';
import { AccountModel } from '../models/account';
import { mockAccountModel } from './mock-account';

export const mockSpotifyRequestTokenParams = (): SpotifyRequestTokenParams => {
  return {
    code: faker.datatype.uuid(),
    state: faker.datatype.uuid(),
    redirectUri: faker.internet.url(),
    encodedAuthorization: faker.datatype.uuid()
  };
};

export const mockSpotifyAccessModel = (): SpotifyAccessModel => ({
  access_token: faker.datatype.uuid(),
  token_type: 'Bearer',
  scope: 'user-read-private user-read-email',
  expires_in: 3600,
  refresh_token: faker.datatype.uuid()
});

export class SpotifyRequestTokenSpy implements SpotifyRequestToken {
  url = faker.internet.url();
  spotifySettings = mockSpotifyRequestTokenParams();
  spotifyClientId = faker.datatype.uuid();
  account = mockAccountModel();
  callsCount = 0;

  async request(): Promise<AccountModel> {
    this.callsCount++;
    return await Promise.resolve(this.account);
  }
}
