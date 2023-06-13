import request from 'supertest';
import app from '@/main/config/app';
import { mockSpotifyRequestTokenParams, mockSpotifyRefreshTokenParams } from '@/domain/test';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

describe('Spotify Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '');
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
});
