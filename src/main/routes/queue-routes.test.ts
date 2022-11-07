import { Collection, ObjectId } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';
import { mockSaveQueueParams } from '@/domain/test';

let queueCollection: Collection;
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

describe('Queue Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '');
  });

  beforeEach(async () => {
    queueCollection = await MongoHelper.getCollection('queue');
    await queueCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /queue', () => {
    test('should return 403 on queue creation without accessToken', async () => {
      await request(app).post('/api/queue').send({ songs: mockSaveQueueParams() }).expect(403);
    });

    test('should return 204 on queue creation with a valid admin accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .post('/api/queue')
        .set('x-access-token', accessToken)
        .send({ songs: mockSaveQueueParams() })
        .expect(204);
    });
  });
});
