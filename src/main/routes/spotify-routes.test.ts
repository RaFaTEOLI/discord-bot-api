import request from 'supertest';
import app from '@/main/config/app';
import { mockSpotifyRequestTokenParams, mockSpotifyRefreshTokenParams } from '@/domain/test';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { describe, test, beforeAll, afterAll, beforeEach } from 'vitest';
import { waitForRouteToLoad } from '@/main/config/integration-test-helper';
import { Collection, ObjectId } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../config/env';

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

describe('Spotify Routes', () => {
  beforeAll(async () => {
    await waitForRouteToLoad('spotify-routes.ts');
    await MongoHelper.connect(globalThis.__MONGO_URI__ ?? '');
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /spotify/auth', () => {
    test('should return 400 on token generation with wrong credentials', async () => {
      await request(app).post('/api/spotify/auth').send(mockSpotifyRequestTokenParams()).expect(400);
    });
  });
  describe('POST /spotify/refresh-token', () => {
    test('should return 403 on token refresh without being authenticated', async () => {
      await request(app).post('/api/spotify/refresh-token').send(mockSpotifyRefreshTokenParams()).expect(403);
    });
  });
  describe('POST /spotify/guest-token', () => {
    test('should return 200 on token retrievel', async () => {
      const accessToken = await makeAccessToken();
      await request(app).get('/api/spotify/guest-token').set('x-access-token', accessToken).send().expect(200);
    });
    test('should return 403 on token retrievel without being authenticated', async () => {
      await request(app).get('/api/spotify/guest-token').send().expect(403);
    });
  });
}, 10000);
