import { Collection, ObjectId } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';
import { describe, test, beforeAll, beforeEach, afterAll } from 'vitest';
import { waitForRouteToLoad } from '@/main/config/integration-test-helper';

let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'Rafael',
    email: 'rafinha.tessarolo@hotmail.com',
    password: '1234',
    role: 'admin'
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

describe('Discord Command Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__ ?? '');
    await waitForRouteToLoad('discord-command-routes.ts');
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('GET /discord/commands', () => {
    test('should return 403 on load commands without accessToken', async () => {
      await request(app).get('/api/discord/commands').expect(403);
    });

    test.skip('should return 200 on load commands with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app).get('/api/discord/commands').set('x-access-token', accessToken).expect(200);
    });
  });
}, 10000);
