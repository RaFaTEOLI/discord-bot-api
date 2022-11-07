import { mockSaveMusicParams } from '@/domain/test';
import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { MusicMongoRepository } from './music-mongo-repository';

const makeSut = (): MusicMongoRepository => {
  return new MusicMongoRepository();
};

let musicCollection: Collection;

describe('Music Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '');
  });

  beforeEach(async () => {
    musicCollection = await MongoHelper.getCollection('music');
    await musicCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('save()', () => {
    test('should save a music on success', async () => {
      const sut = makeSut();
      const fakeMusic = mockSaveMusicParams();
      await sut.save(fakeMusic);
      const music = await musicCollection.findOne();
      expect(music).toBeTruthy();
      expect(music.name).toBe(fakeMusic.name);
    });

    test('should update music without creating a new one', async () => {
      const sut = makeSut();
      const fakeMusic = mockSaveMusicParams();
      await musicCollection.insertOne(mockSaveMusicParams());
      await sut.save(fakeMusic);
      const music = await musicCollection.findOne();
      const count = await musicCollection.find().toArray();
      expect(music).toBeTruthy();
      expect(music.name).toBe(fakeMusic.name);
      expect(count.length).toBe(1);
    });
  });

  describe('load()', () => {
    test('should load music on success', async () => {
      const fakeMusic = mockSaveMusicParams();
      await musicCollection.insertOne(fakeMusic);
      const sut = makeSut();
      const music = await sut.load();
      expect(music.id).toBeTruthy();
      expect(music.name).toBe(fakeMusic.name);
    });

    test('should load a null music on success', async () => {
      const sut = makeSut();
      const music = await sut.load();
      expect(music.id).toBeNull();
      expect(music.name).toBeNull();
    });
  });
});
