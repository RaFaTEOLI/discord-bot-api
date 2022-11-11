import { RemoteSpotifyRequestToken } from '@/data/usecases/spotify/request-token/remote-spotify-request-token';
import { SpotifyRequestToken } from '@/domain/usecases/spotify/spotify-request-token';
import { makeAxiosHttpClient } from '@/main/factories/http';

export const makeSpotifyRequestToken = (): SpotifyRequestToken => {
  return new RemoteSpotifyRequestToken('https://accounts.spotify.com/api/token', makeAxiosHttpClient());
};
