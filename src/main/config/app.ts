import express from 'express';
import setUpMiddlewares from './middlewares';
import setUpRoutes from './routes';
import setUpSwagger from './swagger';
import setUpSocket from './socket';

export const expressApp = express();
setUpSwagger(expressApp);
setUpMiddlewares(expressApp);
setUpRoutes(expressApp);

const app = setUpSocket(expressApp);

export default app;
