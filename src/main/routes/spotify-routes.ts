import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { makeSpotifyRequestTokenController } from '@/main/factories/controllers/spotify/spotify-request-token/spotify-request-token-controller-factory';

export default (router: Router): void => {
  router.post('/spotify/token', adaptRoute(makeSpotifyRequestTokenController()));
};
