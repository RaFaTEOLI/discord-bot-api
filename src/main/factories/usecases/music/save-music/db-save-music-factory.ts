import { SaveMusic } from '@/domain/usecases/music/save-music';
import { DbSaveMusic } from '@/data/usecases/music/save-music/db-save-music';
import { MusicMongoRepository } from '@/infra/db/mongodb/music/music-mongo-repository';

export const makeDbSaveMusic = (): SaveMusic => {
  const musicMongoRepository = new MusicMongoRepository();
  return new DbSaveMusic(musicMongoRepository);
};
