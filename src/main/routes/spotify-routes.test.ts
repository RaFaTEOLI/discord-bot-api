import request from 'supertest';
import app from '@/main/config/app';
import { mockSpotifyRequestTokenParams, mockSpotifyRefreshTokenParams } from '@/domain/test';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { describe, test, beforeAll, afterAll } from 'vitest';
import { waitForRouteToLoad } from '@/main/config/integration-test-helper';

describe(
  'Spotify Routes',
  () => {
    beforeAll(async () => {
      await waitForRouteToLoad('spotify-routes.ts');
      await MongoHelper.connect(globalThis.__MONGO_URI__ ?? '');
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
  },
  { timeout: 10000 }
);
