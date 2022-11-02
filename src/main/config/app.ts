import express from 'express';
import setUpMiddlewares from './middlewares';
import setUpRoutes from './routes';
import setUpSwagger from './swagger';

const app = express();
setUpSwagger(app);
setUpMiddlewares(app);
setUpRoutes(app);
export default app;
