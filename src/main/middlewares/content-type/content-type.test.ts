import request from 'supertest';
import { expressApp as app } from '@/main/config/app';
import { afterAll, describe, test } from 'vitest';
import { cleanUpLoadedRoutes } from '@/main/config/integration-test-helper';

describe('Content Type Middleware', () => {
  afterAll(async () => {
    await cleanUpLoadedRoutes();
  });

  test('should return default content type as json', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send('');
    });
    await request(app).get('/test-content-type').expect('content-type', /json/);
  });

  test('should return xml content type when forced', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml');
      res.send('');
    });
    await request(app).get('/test-content-type-xml').expect('content-type', /xml/);
  });
});
