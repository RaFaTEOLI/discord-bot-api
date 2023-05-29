import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { auth } from '@/main/middlewares/auth/auth';
import { makeSaveAccountController } from '@/main/factories/controllers/account/save-account/save-account-controller-factory';

export default (router: Router): void => {
  router.patch('/account', auth, adaptRoute(makeSaveAccountController()));
};
