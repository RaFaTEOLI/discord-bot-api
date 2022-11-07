import { SaveMusicRepository } from '@/data/protocols/db/music/save-music-repository';
import { LoadMusicRepository } from '@/data/protocols/db/music/load-music-repository';
import { SaveMusicParams } from '@/domain/usecases/music/save-music';
import { MusicModel } from '@/domain/models/music';
import { mockMusicModel } from '@/domain/test';

export const mockSaveMusicRepository = (fakeMusic = mockMusicModel()): SaveMusicRepository => {
  class SaveMusicRepositoryStub implements SaveMusicRepository {
    async save(data: SaveMusicParams): Promise<MusicModel> {
      return await Promise.resolve(fakeMusic);
    }
  }
  return new SaveMusicRepositoryStub();
};

export const mockLoadMusicRepository = (): LoadMusicRepository => {
  class LoadMusicRepositoryStub implements LoadMusicRepository {
    async load(): Promise<MusicModel> {
      return await Promise.resolve(mockMusicModel());
    }
  }
  return new LoadMusicRepositoryStub();
};
