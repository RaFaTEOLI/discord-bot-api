import { MusicModel } from '@/domain/models/music';
import { SaveMusicParams } from '@/domain/usecases/music/save-music';
import { faker } from '@faker-js/faker';

export const mockMusicModel = (): MusicModel => {
  return {
    id: faker.datatype.uuid(),
    name: faker.random.word(),
    startedAt: Math.floor(Date.now() / 1000)
  };
};

export const mockSaveMusicParams = (): SaveMusicParams => ({
  name: faker.random.word()
});
