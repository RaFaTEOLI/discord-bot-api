import { Collection, ObjectId } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';
import { mockMusicModel } from '@/domain/test';

let musicCollection: Collection;
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

describe('music Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '');
  });

  beforeEach(async () => {
    musicCollection = await MongoHelper.getCollection('music');
    await musicCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /music', () => {
    test('should return 403 on music creation without accessToken', async () => {
      await request(app).post('/api/music').send(mockMusicModel()).expect(403);
    });

    test('should return 204 on music creation with a valid admin accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app).post('/api/music').set('x-access-token', accessToken).send(mockMusicModel()).expect(204);
    });
  });
});
