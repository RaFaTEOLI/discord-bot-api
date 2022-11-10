import { RemoteSpotifyRequestToken } from '@/data/usecases/spotify-request-token/remote-spotify-request-token';
import { SpotifyRequestToken } from '@/domain/usecases/spotify/spotify-request-token';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { makeAxiosHttpClient } from '@/main/factories/http';

export const makeSpotifyRequestToken = (): SpotifyRequestToken => {
  const accountMongoRepository = new AccountMongoRepository();
  return new RemoteSpotifyRequestToken(
    'https://accounts.spotify.com/api/token',
    makeAxiosHttpClient(),
    accountMongoRepository,
    makeAxiosHttpClient()
  );
};
