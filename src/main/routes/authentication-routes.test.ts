import { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import { hash } from 'bcrypt';
import { describe, test, beforeAll, beforeEach, afterAll } from 'vitest';
import { cleanUpLoadedRoutes, waitForRouteToLoad } from '@/main/config/integration-test-helper';

let accountCollection: Collection;
describe(
  'Authentication Routes',
  () => {
    beforeAll(async () => {
      await waitForRouteToLoad('authentication-routes.ts');
      await MongoHelper.connect(globalThis.__MONGO_URI__ ?? '');
    });

    beforeEach(async () => {
      accountCollection = await MongoHelper.getCollection('accounts');
      await accountCollection.deleteMany({});
    });

    afterAll(async () => {
      await MongoHelper.disconnect();
      await cleanUpLoadedRoutes();
    });

    describe('POST /signup', () => {
      test('should return 200 on signup', async () => {
        await request(app)
          .post('/api/signup')
          .send({
            name: 'Rafael',
            email: 'rafinha.tessarolo@hotmail.com',
            password: '123',
            passwordConfirmation: '123'
          })
          .expect(200);
      });
    });

    describe('POST /login', () => {
      test('should return 200 on login', async () => {
        const password = await hash('123', 12);
        await accountCollection.insertOne({
          name: 'Rafael',
          email: 'rafinha.tessarolo@hotmail.com',
          password
        });
        await request(app)
          .post('/api/login')
          .send({
            email: 'rafinha.tessarolo@hotmail.com',
            password: '123'
          })
          .expect(200);
      });

      test('should return 401 if login fails', async () => {
        await request(app)
          .post('/api/login')
          .send({
            email: 'rafinha.tessarolo@hotmail.com',
            password: '123'
          })
          .expect(401);
      });
    });
  },
  { timeout: 10000 }
);
