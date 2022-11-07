import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { adminAuth } from '@/main/middlewares/auth/admin-auth';
import { auth } from '@/main/middlewares/auth/auth';
import { makeSaveMusicController } from '@/main/factories/controllers/music/save-music/save-music-controller-factory';
import { makeLoadMusicController } from '@/main/factories/controllers/music/load-music/load-music-controller-factory';

export default (router: Router): void => {
  router.post('/music', adminAuth, adaptRoute(makeSaveMusicController()));
  router.get('/music', auth, adaptRoute(makeLoadMusicController()));
};
