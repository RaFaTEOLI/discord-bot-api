import { Collection, ObjectId } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';
import { mockMusicModel } from '@/domain/test';
import { faker } from '@faker-js/faker';
import { describe, test, beforeAll, beforeEach, afterAll } from 'vitest';
import { cleanUpLoadedRoutes, waitForRouteToLoad } from '@/main/config/integration-test-helper';

let musicCollection: Collection;
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
  'Music Routes',
  () => {
    beforeAll(async () => {
      await waitForRouteToLoad('music-routes.ts');
      await MongoHelper.connect(globalThis.__MONGO_URI__ ?? '');
    });

    beforeEach(async () => {
      musicCollection = await MongoHelper.getCollection('music');
      await musicCollection.deleteMany({});

      accountCollection = await MongoHelper.getCollection('accounts');
      await accountCollection.deleteMany({});
    });

    afterAll(async () => {
      await MongoHelper.disconnect();
      await cleanUpLoadedRoutes();
    });

    describe('POST /music', () => {
      test('should return 403 on music creation without accessToken', async () => {
        await request(app).post('/api/music').send(mockMusicModel()).expect(403);
      });

      test('should return 204 on music creation with a valid admin accessToken', async () => {
        const accessToken = await makeAccessToken();
        await request(app)
          .post('/api/music')
          .set('x-access-token', accessToken)
          .send(mockMusicModel())
          .expect(204);
      });
    });

    describe('GET /music', () => {
      test('should return 403 on load music without accessToken', async () => {
        await request(app).get('/api/music').expect(403);
      });

      test('should return 200 on load music with valid admin accessToken', async () => {
        const accessToken = await makeAccessToken();

        await musicCollection.insertOne({
          name: faker.random.word(),
          startedAt: Math.floor(Date.now() / 1000)
        });

        await request(app).get('/api/music').set('x-access-token', accessToken).expect(200);
      });

      test('should return 200 on load music with valid normal accessToken', async () => {
        const accessToken = await makeAccessToken(false);

        await musicCollection.insertOne({
          name: faker.random.word(),
          startedAt: Math.floor(Date.now() / 1000)
        });

        await request(app).get('/api/music').set('x-access-token', accessToken).expect(200);
      });

      test('should return 200 on load empty music with valid accessToken', async () => {
        const accessToken = await makeAccessToken();
        await request(app).get('/api/music').set('x-access-token', accessToken).expect(200);
      });
    });
  },
  { timeout: 10000 }
);
