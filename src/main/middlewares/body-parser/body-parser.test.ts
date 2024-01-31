import request from 'supertest';
import { expressApp as app } from '@/main/config/app';
import { afterAll, describe, test } from 'vitest';
import { cleanUpLoadedRoutes } from '@/main/config/integration-test-helper';

describe('Body Parser Middleware', () => {
  afterAll(async () => {
    await cleanUpLoadedRoutes();
  });

  test('should parse body as json', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body);
    });
    await request(app).post('/test-body-parser').send({ name: 'Rafael' }).expect({ name: 'Rafael' });
  });
});
