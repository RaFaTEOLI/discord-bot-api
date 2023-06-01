import { RemoteSpotifyRefreshToken } from '@/data/usecases/spotify/refresh-token/remote-spotify-refresh-token';
import { SpotifyRefreshToken } from '@/domain/usecases/spotify/spotify-refresh-token';
import { makeAxiosHttpClient } from '@/main/factories/http';

export const makeSpotifyRefreshToken = (): SpotifyRefreshToken => {
  return new RemoteSpotifyRefreshToken('https://accounts.spotify.com/api/token', makeAxiosHttpClient());
};
