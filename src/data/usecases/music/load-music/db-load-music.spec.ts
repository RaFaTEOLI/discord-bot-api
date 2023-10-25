import { LoadMusicRepository } from './db-load-music-protocols';
import { DbLoadMusic } from './db-load-music';
import { mockLoadMusicRepository } from '@/data/test';
import { describe, test, expect, vi } from 'vitest';

interface SutTypes {
  sut: DbLoadMusic;
  loadMusicRepositoryStub: LoadMusicRepository;
}

const makeSut = (): SutTypes => {
  const loadMusicRepositoryStub = mockLoadMusicRepository();
  const sut = new DbLoadMusic(loadMusicRepositoryStub);
  return {
    sut,
    loadMusicRepositoryStub
  };
};

describe('DdLoadMusic Usecase', () => {
  test('should call LoadMusicRepository', async () => {
    const { sut, loadMusicRepositoryStub } = makeSut();
    const loadSpy = vi.spyOn(loadMusicRepositoryStub, 'load');
    await sut.load();
    expect(loadSpy).toHaveBeenCalled();
  });

  test('should return a music on LoadMusicRepository success', async () => {
    const { sut } = makeSut();
    const music = await sut.load();
    expect(music).toBeTruthy();
  });
});
