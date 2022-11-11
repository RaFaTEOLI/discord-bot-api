import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { makeSpotifyAuthenticateController } from '@/main/factories/controllers/spotify/spotify-authenticate/spotify-authenticate-controller-factory';

export default (router: Router): void => {
  router.post('/spotify/auth', adaptRoute(makeSpotifyAuthenticateController()));
};
