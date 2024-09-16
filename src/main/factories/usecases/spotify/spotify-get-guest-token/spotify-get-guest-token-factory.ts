import { RemoteSpotifyGetGuestToken } from '@/data/usecases/spotify/get-guest-token/remote-spotify-get-guest-token';
import { SpotifyGetGuestToken } from '@/domain/usecases/spotify/spotify-get-guest-token';
import env from '@/main/config/env';
import { makeNodeCacheAdapter } from '@/main/factories/cache/node-cache-adapter-factory';
import { makeAxiosHttpClient } from '@/main/factories/http';

export const makeSpotifyGetGuestToken = (): SpotifyGetGuestToken => {
  const nodeCacheAdapter = makeNodeCacheAdapter();
  return new RemoteSpotifyGetGuestToken(
    env.spotifyGuestTokenUrl,
    nodeCacheAdapter,
    nodeCacheAdapter,
    makeAxiosHttpClient()
  );
};
