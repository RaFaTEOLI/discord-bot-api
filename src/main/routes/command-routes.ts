import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { makeSaveCommandController } from '@/main/factories/controllers/command/save-command/save-command-controller-factory';
import { makeLoadCommandsController } from '@/main/factories/controllers/command/load-commands/load-commands-controller-factory';
import { makeUpdateCommandController } from '@/main/factories/controllers/command/update-command/update-command-controller-factory';
import { makeLoadCommandByIdController } from '@/main/factories/controllers/command/load-command-by-id/load-command-by-id-controller-factory';
import { makeDeleteCommandByIdController } from '@/main/factories/controllers/command/delete-command-by-id/delete-command-by-id-controller-factory';
import { adminAuth } from '@/main/middlewares/auth/admin-auth';
import { auth } from '@/main/middlewares/auth/auth';
import { makePatchUpdateCommandController } from '@/main/factories/controllers/command/patch-update-command/update-command-controller-factory';

export default (router: Router): void => {
  router.post('/commands', adminAuth, adaptRoute(makeSaveCommandController()));
  router.put('/commands/:commandId', adminAuth, adaptRoute(makeUpdateCommandController()));
  router.get('/commands', auth, adaptRoute(makeLoadCommandsController()));
  router.get('/commands/:commandId', auth, adaptRoute(makeLoadCommandByIdController()));
  router.delete('/commands/:commandId', adminAuth, adaptRoute(makeDeleteCommandByIdController()));
  router.patch('/commands/:commandId', adminAuth, adaptRoute(makePatchUpdateCommandController()));
};
