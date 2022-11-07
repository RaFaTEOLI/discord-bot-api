import { SaveMusic, SaveMusicParams } from '@/domain/usecases/music/save-music';
import { MusicModel } from '@/domain/models/music';
import { mockMusicModel } from '@/domain/test';
import { LoadMusic } from '@/domain/usecases/music/load-music';

export const mockSaveMusic = (): SaveMusic => {
  class SaveMusicStub implements SaveMusic {
    async save(data: SaveMusicParams): Promise<MusicModel> {
      return await Promise.resolve(mockMusicModel());
    }
  }
  return new SaveMusicStub();
};

export const mockLoadMusic = (fakeMusic = mockMusicModel()): LoadMusic => {
  class LoadMusicStub implements LoadMusic {
    async load(): Promise<MusicModel> {
      return await Promise.resolve(fakeMusic);
    }
  }
  return new LoadMusicStub();
};
