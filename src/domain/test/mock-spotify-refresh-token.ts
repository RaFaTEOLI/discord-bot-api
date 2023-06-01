import { faker } from '@faker-js/faker';
import { SpotifyRefreshToken, SpotifyRefreshTokenParams } from '@/domain/usecases/spotify/spotify-refresh-token';
import { SpotifyAccessModel } from '../models/spotify';

export const mockSpotifyRefreshTokenParams = (signUp = false): SpotifyRefreshTokenParams => {
  return {
    refreshToken: faker.datatype.uuid(),
    encodedAuthorization: faker.datatype.uuid()
  };
};

export const mockSpotifyAccessModelWithoutRefreshToken = (): SpotifyAccessModel => ({
  access_token: faker.datatype.uuid(),
  token_type: 'Bearer',
  scope: 'user-read-private user-read-email',
  expires_in: 3600
});

export class SpotifyRefreshTokenSpy implements SpotifyRefreshToken {
  url = faker.internet.url();
  spotifySettings = mockSpotifyRefreshTokenParams();
  spotifyClientId = faker.datatype.uuid();
  accessModel = mockSpotifyAccessModelWithoutRefreshToken();
  callsCount = 0;

  async refresh(): Promise<SpotifyAccessModel> {
    this.callsCount++;
    return await Promise.resolve(this.accessModel);
  }
}
