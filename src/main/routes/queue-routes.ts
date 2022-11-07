import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { adminAuth } from '@/main/middlewares/auth/admin-auth';
import { makeSaveQueueController } from '@/main/factories/controllers/queue/save-queue/save-queue-controller-factory';

export default (router: Router): void => {
  router.post('/queue', adminAuth, adaptRoute(makeSaveQueueController()));
};
