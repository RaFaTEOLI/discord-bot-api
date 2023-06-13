import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { makeSpotifyAuthenticateController } from '@/main/factories/controllers/spotify/spotify-authenticate/spotify-authenticate-controller-factory';
import { makeSpotifyRefreshTokenController } from '@/main/factories/controllers/spotify/spotify-refresh-token/spotify-refresh-token-controller-factory';
import { auth } from '@/main/middlewares/auth/auth';

export default (router: Router): void => {
  router.post('/spotify/auth', adaptRoute(makeSpotifyAuthenticateController()));
  router.post('/spotify/refresh-token', auth, adaptRoute(makeSpotifyRefreshTokenController()));
};
