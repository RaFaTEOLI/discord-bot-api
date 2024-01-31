import request from 'supertest';
import { expressApp as app } from '@/main/config/app';
import { afterAll, describe, test } from 'vitest';
import { cleanUpLoadedRoutes } from '@/main/config/integration-test-helper';

describe('Cors Middleware', () => {
  afterAll(async () => {
    await cleanUpLoadedRoutes();
  });

  test('should enable cors', async () => {
    app.get('/test-cors', (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  });
});
