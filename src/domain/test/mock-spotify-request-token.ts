import { faker } from '@faker-js/faker';
import { SpotifyRequestToken, SpotifyRequestTokenParams } from '@/domain/usecases/spotify/spotify-request-token';
import { SpotifyAccessModel, SpotifyUserModel } from '../models/spotify';
import { SpotifyLoadUserParams } from '@/domain/usecases/spotify/spotify-load-user';

export const mockSpotifyRequestTokenParams = (): SpotifyRequestTokenParams => {
  return {
    code: faker.datatype.uuid(),
    state: faker.datatype.uuid(),
    redirectUri: faker.internet.url(),
    encodedAuthorization: faker.datatype.uuid()
  };
};

export const mockSpotifyLoadUserParams = (): SpotifyLoadUserParams => {
  return {
    accessToken: faker.datatype.uuid(),
    refreshToken: faker.datatype.uuid(),
    redirectUri: faker.internet.url()
  };
};

export const mockSpotifyAccessModel = (): SpotifyAccessModel => ({
  access_token: faker.datatype.uuid(),
  token_type: 'Bearer',
  scope: 'user-read-private user-read-email',
  expires_in: 3600,
  refresh_token: faker.datatype.uuid()
});

export const mockSpotifyUserModel = (): SpotifyUserModel => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  display_name: faker.name.fullName()
});

export class SpotifyRequestTokenSpy implements SpotifyRequestToken {
  url = faker.internet.url();
  spotifySettings = mockSpotifyRequestTokenParams();
  spotifyClientId = faker.datatype.uuid();
  accessModel = mockSpotifyAccessModel();
  callsCount = 0;

  async request(): Promise<SpotifyAccessModel> {
    this.callsCount++;
    return await Promise.resolve(this.accessModel);
  }
}
