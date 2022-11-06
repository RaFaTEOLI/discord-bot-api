import { MusicModel } from '@/domain/models/music';
import { SaveMusicParams } from '@/domain/usecases/music/save-music';
import { faker } from '@faker-js/faker';

export const mockMusicModel = (): MusicModel => {
  return {
    id: faker.datatype.uuid(),
    name: faker.random.word(),
    startedAt: Date.now()
  };
};

export const mockSaveMusicParams = (): SaveMusicParams => ({
  name: faker.random.word(),
  startedAt: Date.now()
});
