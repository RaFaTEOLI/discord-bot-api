import swaggerConfig from '@/main/docs';
import { Express } from 'express';
import { serve, setup } from 'swagger-ui-express';
import { noCache } from '../middlewares';

export default (app: Express): void => {
  app.use('/api-docs', serve, noCache, setup(swaggerConfig));
};
