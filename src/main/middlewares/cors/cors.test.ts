import request from 'supertest';
import { expressApp as app } from '@/main/config/app';
import { describe, test } from 'vitest';

describe('Cors Middleware', () => {
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
