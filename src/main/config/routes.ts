import { Express, Router } from 'express';
import { readdirSync, readFile, writeFile } from 'fs';
import path from 'path';
import env from './env';

if (env.nodeEnv === 'test') {
  const filePath = path.join(__dirname, 'loaded_routes.json');
  var loadedRoutes = [];
  readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      writeFile(filePath, JSON.stringify(loadedRoutes), err => {
        console.error(`Error writing loaded_routes.json: ${err?.message}`);
      });
    }
    loadedRoutes = JSON.parse(data ?? '[]');
  });
}

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  router.get('/health-check', (req, res) => res.json({ message: "It's working!" }));
  readdirSync(path.join(__dirname, '/../routes')).map(async file => {
    if (!file.includes('.test') && !file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router);
      if (env.nodeEnv === 'test') {
        loadedRoutes.push(file);
        writeFile(path.join(__dirname, 'loaded_routes.json'), JSON.stringify(loadedRoutes), err => {
          console.error(`Error writing loaded_routes.json: ${err?.message}`);
        });
      }
    }
  });
};
