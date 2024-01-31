import request from 'supertest';
import { expressApp as app } from '@/main/config/app';
import { noCache } from './no-cache';
import { afterAll, describe, test } from 'vitest';
import { cleanUpLoadedRoutes } from '@/main/config/integration-test-helper';

describe('NoCache Middleware', () => {
  afterAll(async () => {
    await cleanUpLoadedRoutes();
  });

  test('should disable caching', async () => {
    app.get('/test-no-cache', noCache, (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test-no-cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store');
  });
});
