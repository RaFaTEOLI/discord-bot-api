import { Collection, ObjectId } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';

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
    await MongoHelper.connect(process.env.MONGO_URL ?? '');
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
      await request(app)
        .post('/api/commands')
        .send({
          command: 'any_command',
          dispatcher: 'message',
          type: 'message',
          description: 'any_description',
          response: 'any_response',
          message: 'any_message'
        })
        .expect(403);
    });

    test('should return 204 on command creation with a valid admin accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .post('/api/commands')
        .set('x-access-token', accessToken)
        .send({
          command: 'any_command',
          dispatcher: 'message',
          type: 'message',
          description: 'any_description',
          response: 'any_response',
          message: 'any_message'
        })
        .expect(204);
    });

    test('should return 400 on duplicate command creation with admin accessToken', async () => {
      const accessToken = await makeAccessToken();
      await commandCollection.insertOne({
        command: 'any_command',
        dispatcher: 'message',
        type: 'message',
        description: 'any_description',
        response: 'any_response',
        message: 'any_message'
      });
      await request(app)
        .post('/api/commands')
        .set('x-access-token', accessToken)
        .send({
          command: 'any_command',
          dispatcher: 'message',
          type: 'message',
          description: 'any_description',
          response: 'any_response',
          message: 'any_message'
        })
        .expect(400);
    });
  });

  describe('GET /commands', () => {
    test('should return 403 on load commands without accessToken', async () => {
      await request(app).get('/api/commands').expect(403);
    });

    test('should return 200 on load commands with valid accessToken', async () => {
      const accessToken = await makeAccessToken();

      await commandCollection.insertMany([
        {
          command: 'any_command',
          dispatcher: 'message',
          type: 'message',
          description: 'any_description',
          response: 'any_response',
          message: 'any_message'
        },
        {
          command: 'any_command_2',
          dispatcher: 'message_2',
          type: 'any_type_2',
          description: 'any_description_2',
          response: 'any_response_2',
          message: 'any_message_2'
        }
      ]);

      await request(app).get('/api/commands').set('x-access-token', accessToken).expect(200);
    });

    test('should return 204 on empty load commands with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app).get('/api/commands').set('x-access-token', accessToken).expect(204);
    });
  });

  describe('PUT /commands/{commandId}', () => {
    test('should return 403 on command update without accessToken', async () => {
      await request(app)
        .put('/api/commands/any_id')
        .send({
          command: 'any_command',
          dispatcher: 'message',
          type: 'message',
          description: 'any_description',
          response: 'any_response',
          message: 'any_message'
        })
        .expect(403);
    });

    test('should return 204 on command update with a valid admin accessToken', async () => {
      const accessToken = await makeAccessToken();
      const result = await commandCollection.insertOne({
        command: 'any_command',
        dispatcher: 'message',
        type: 'message',
        description: 'any_description',
        response: 'any_response',
        message: 'any_message'
      });
      const id = result.insertedId.toString();
      await request(app)
        .put(`/api/commands/${id}`)
        .set('x-access-token', accessToken)
        .send({
          command: 'any_command',
          dispatcher: 'message',
          type: 'message',
          description: 'any_description',
          response: 'any_response',
          message: 'any_message'
        })
        .expect(204);
    });
  });

  describe('GET /commands/{commandId}', () => {
    test('should return 403 on load command without accessToken', async () => {
      await request(app).get('/api/commands/any_id').expect(403);
    });

    test('should return 200 on load command with valid accessToken', async () => {
      const accessToken = await makeAccessToken();

      const result = await commandCollection.insertOne({
        command: 'any_command',
        dispatcher: 'message',
        type: 'message',
        description: 'any_description',
        response: 'any_response',
        message: 'any_message'
      });
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
});
