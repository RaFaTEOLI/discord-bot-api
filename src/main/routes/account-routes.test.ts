import { Collection, ObjectId } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';
import { mockAccountModelWithSpotifyAndDiscord } from '@/domain/test';
import { describe, test, beforeAll, beforeEach, afterAll } from 'vitest';
import { cleanUpLoadedRoutes, waitForRouteToLoad } from '@/main/config/integration-test-helper';

let accountCollection: Collection;

const makeAccessToken = async (admin = true): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'Rafael',
    email: 'rafinha.tessarolo@hotmail.com',
    password: '1234',
    ...(admin && { role: 'admin' })
  });

  const id = result.insertedId.toString();
  const accessToken = sign({ id }, env.jwtSecret);

  await accountCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        accessToken
      }
    }
  );
  return accessToken;
};

describe(
  'Account Routes',
  () => {
    beforeAll(async () => {
      await waitForRouteToLoad('account-routes.ts');
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

    describe('PATCH /account', () => {
      test('should return 403 on account save creation without accessToken', async () => {
        await request(app).patch('/api/account').send(mockAccountModelWithSpotifyAndDiscord()).expect(403);
      });

      test('should return 204 on account save with a valid admin accessToken', async () => {
        const accessToken = await makeAccessToken();
        await request(app)
          .patch('/api/account')
          .set('x-access-token', accessToken)
          .send(mockAccountModelWithSpotifyAndDiscord())
          .expect(204);
      });
    });
  },
  { timeout: 10000 }
);
