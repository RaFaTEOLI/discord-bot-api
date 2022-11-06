import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { adminAuth } from '@/main/middlewares/auth/admin-auth';
import { makeSaveMusicController } from '@/main/factories/controllers/music/save-music/save-music-controller-factory';

export default (router: Router): void => {
  router.post('/music', adminAuth, adaptRoute(makeSaveMusicController()));
};
