import { RemoteSpotifyLoadUser } from '@/data/usecases/spotify/load-user/remote-spotify-load-user';
import { SpotifyLoadUser } from '@/domain/usecases/spotify/spotify-load-user';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { makeAxiosHttpClient } from '@/main/factories/http';

export const makeSpotifyLoadUser = (): SpotifyLoadUser => {
  const accountMongoRepository = new AccountMongoRepository();
  return new RemoteSpotifyLoadUser('https://api.spotify.com/v1/me', makeAxiosHttpClient(), accountMongoRepository);
};
