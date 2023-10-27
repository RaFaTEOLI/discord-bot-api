import { Collection, ObjectId } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';
import { describe, test, beforeAll, beforeEach, afterAll } from 'vitest';
import { mockSaveCommandParams } from '@/domain/test';

let commandCollection: Collection;
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

describe('Command Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__ ?? '');
  });

  beforeEach(async () => {
    commandCollection = await MongoHelper.getCollection('commands');
    await commandCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /commands', () => {
    test('should return 403 on command creation without accessToken', async () => {
      await request(app).post('/api/commands').send(mockSaveCommandParams()).expect(403);
    });

    test('should return 204 on command creation with a valid admin accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .post('/api/commands')
        .set('x-access-token', accessToken)
        .send(mockSaveCommandParams())
        .expect(204);
    });

    test('should return 400 on duplicate command creation with admin accessToken', async () => {
      const accessToken = await makeAccessToken();
      const command = mockSaveCommandParams();
      await commandCollection.insertOne(command);
      await request(app).post('/api/commands').set('x-access-token', accessToken).send(command).expect(400);
    });
  });

  describe('GET /commands', () => {
    test('should return 403 on load commands without accessToken', async () => {
      await request(app).get('/api/commands').expect(403);
    });

    test('should return 200 on load commands with valid accessToken', async () => {
      const accessToken = await makeAccessToken();

      await commandCollection.insertMany([mockSaveCommandParams(), mockSaveCommandParams()]);

      await request(app).get('/api/commands').set('x-access-token', accessToken).expect(200);
    });

    test('should return 204 on empty load commands with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app).get('/api/commands').set('x-access-token', accessToken).expect(204);
    });
  });

  describe('GET /commands?name={commandName}', () => {
    test('should return 403 on load command by name without accessToken', async () => {
      await request(app).get('/api/commands?name=any_command').expect(403);
    });

    test('should return 200 on load command by name with valid accessToken', async () => {
      const accessToken = await makeAccessToken();

      const commands = [mockSaveCommandParams(), mockSaveCommandParams()];

      await commandCollection.insertMany(commands);

      const response = await request(app)
        .get(`/api/commands?name=${commands[0].command}`)
        .set('x-access-token', accessToken)
        .expect(200);
      response.body.command = commands[0].command;
    });

    test('should return 204 on empty load command by name with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app).get('/api/commands?name=invalid_command').set('x-access-token', accessToken).expect(204);
    });
  });

  describe('PUT /commands/{commandId}', () => {
    test('should return 403 on command update without accessToken', async () => {
      await request(app).put('/api/commands/any_id').send(mockSaveCommandParams()).expect(403);
    });

    test('should return 204 on command update with a valid admin accessToken', async () => {
      const accessToken = await makeAccessToken();
      const command = mockSaveCommandParams();
      const result = await commandCollection.insertOne(command);
      const id = result.insertedId.toString();
      await request(app).put(`/api/commands/${id}`).set('x-access-token', accessToken).send(command).expect(204);
    });
  });

  describe('GET /commands/{commandId}', () => {
    test('should return 403 on load command without accessToken', async () => {
      await request(app).get('/api/commands/any_id').expect(403);
    });

    test('should return 200 on load command with valid accessToken', async () => {
      const accessToken = await makeAccessToken();

      const result = await commandCollection.insertOne(mockSaveCommandParams());
      const id = result.insertedId.toString();

      await request(app).get(`/api/commands/${id}`).set('x-access-token', accessToken).expect(200);
    });

    test('should return 204 on empty load command with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .get('/api/commands/6362865d9c9e03dd9d0a9c91')
        .set('x-access-token', accessToken)
        .expect(204);
    });
  });

  describe('DELETE /commands/{commandId}', () => {
    test('should return 403 on command delete without accessToken', async () => {
      await request(app).delete('/api/commands/any_id').expect(403);
    });

    test('should return 204 on command delete with a valid admin accessToken', async () => {
      const accessToken = await makeAccessToken();
      const result = await commandCollection.insertOne(mockSaveCommandParams());
      const id = result.insertedId.toString();
      await request(app).delete(`/api/commands/${id}`).set('x-access-token', accessToken).expect(204);
    });

    test('should return 400 on command delete with invalid id', async () => {
      const accessToken = await makeAccessToken();
      const result = await commandCollection.insertOne(mockSaveCommandParams());
      const id = result.insertedId.toString();
      await commandCollection.deleteMany({});
      await request(app).delete(`/api/commands/${id}`).set('x-access-token', accessToken).expect(400);
    });
  });
});
