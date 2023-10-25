import { mockSaveQueueParams } from '@/domain/test';
import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { QueueMongoRepository } from './queue-mongo-repository';
import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest';

const makeSut = (): QueueMongoRepository => {
  return new QueueMongoRepository();
};

let queueCollection: Collection;

describe('Queue Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__ ?? '');
  });

  beforeEach(async () => {
    queueCollection = await MongoHelper.getCollection('queue');
    await queueCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('save()', () => {
    test('should save a queue on success', async () => {
      const sut = makeSut();
      const fakeQueue = mockSaveQueueParams();
      await sut.save(fakeQueue);
      const queue = await queueCollection.find().toArray();
      expect(queue.length).toBe(fakeQueue.length);
    });

    test('should clear previous queue before saving new one', async () => {
      const sut = makeSut();
      const fakeQueue = mockSaveQueueParams(1);
      await queueCollection.insertMany(mockSaveQueueParams(3));
      await sut.save(fakeQueue);
      const queue = await queueCollection.find().toArray();
      expect(queue.length).toBe(1);
    });

    test('should not call save if songs.length is 0', async () => {
      const sut = makeSut();
      await sut.save([] as any);
      const queue = await queueCollection.find().toArray();
      expect(queue.length).toBe(0);
    });
  });

  describe('load()', () => {
    test('should load queue on success', async () => {
      const fakeQueue = mockSaveQueueParams();
      await queueCollection.insertMany(fakeQueue);
      const sut = makeSut();
      const queue = await sut.load();
      expect(queue.length).toBe(4);
      expect(queue[0].id).toBeTruthy();
      expect(queue[0].name).toBeTruthy();
      expect(queue[0].author).toBeTruthy();
      expect(queue[0].url).toBeTruthy();
      expect(queue[0].thumbnail).toBeTruthy();
      expect(queue[0].duration).toBeTruthy();
    });

    test('should load an empty array if there is no active queue', async () => {
      const sut = makeSut();
      const queue = await sut.load();
      expect(queue.length).toBe(0);
    });
  });
});
