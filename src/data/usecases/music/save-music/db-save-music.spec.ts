import { SaveMusicRepository } from './db-save-music-protocols';
import { DbSaveMusic } from './db-save-music';
import MockDate from 'mockdate';
import { mockSaveMusicRepository } from '@/data/test';
import { mockSaveMusicParams } from '@/domain/test';
import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';

interface SutTypes {
  sut: DbSaveMusic;
  saveMusicRepositoryStub: SaveMusicRepository;
}

const makeSut = (): SutTypes => {
  const saveMusicRepositoryStub = mockSaveMusicRepository();
  const sut = new DbSaveMusic(saveMusicRepositoryStub);
  return {
    sut,
    saveMusicRepositoryStub
  };
};

describe('DdSaveMusic Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call SaveMusicRepository with correct values', async () => {
    const { sut, saveMusicRepositoryStub } = makeSut();
    const saveSpy = vi.spyOn(saveMusicRepositoryStub, 'save');
    const musicData = mockSaveMusicParams();
    await sut.save(musicData);
    expect(saveSpy).toHaveBeenCalledWith({ ...musicData, startedAt: Math.floor(Date.now() / 1000) });
  });

  test('should return a music on SaveMusicRepository success', async () => {
    const { sut } = makeSut();
    const music = await sut.save(mockSaveMusicParams());
    expect(music).toBeTruthy();
  });
});
