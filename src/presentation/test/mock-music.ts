import { SaveMusic, SaveMusicParams } from '@/domain/usecases/music/save-music';
import { MusicModel } from '@/domain/models/music';
import { mockMusicModel } from '@/domain/test';

export const mockSaveMusic = (): SaveMusic => {
  class SaveMusicStub implements SaveMusic {
    async save(data: SaveMusicParams): Promise<MusicModel> {
      return await Promise.resolve(mockMusicModel());
    }
  }
  return new SaveMusicStub();
};
