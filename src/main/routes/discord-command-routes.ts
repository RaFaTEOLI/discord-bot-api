import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { adminAuth } from '@/main/middlewares/auth/admin-auth';
import { makeLoadDiscordCommandsController } from '@/main/factories/controllers/command/load-discord-commands/load-discord-commands-controller-factory';

export default (router: Router): void => {
  router.get('/discord/commands', adminAuth, adaptRoute(makeLoadDiscordCommandsController()));
};
