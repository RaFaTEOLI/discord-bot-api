import { faker } from '@faker-js/faker';
import { SpotifyGuestTokenModel } from '../models/spotify';

export const mockSpotifyGuestTokenModel = (): SpotifyGuestTokenModel => ({
  accessToken: faker.datatype.uuid(),
  accessTokenExpirationTimestampMs: faker.datatype.number(),
  clientId: faker.datatype.uuid(),
  isAnonymous: faker.datatype.boolean()
});
