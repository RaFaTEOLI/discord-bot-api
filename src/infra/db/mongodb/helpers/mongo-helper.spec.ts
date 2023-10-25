import { MongoHelper as sut } from './mongo-helper';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';

describe('Mongo Helper', () => {
  beforeAll(async () => await sut.connect(globalThis.__MONGO_URI__ ?? ''));
  afterAll(async () => await sut.disconnect());

  test('should reconnect if mongodb is down', async () => {
    let accountsCollection = await sut.getCollection('accounts');
    expect(accountsCollection).toBeTruthy();
    await sut.disconnect();
    accountsCollection = await sut.getCollection('accounts');
    expect(accountsCollection).toBeTruthy();
  });
});
