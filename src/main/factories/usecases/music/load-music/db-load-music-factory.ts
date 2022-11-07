import { LoadMusic } from '@/domain/usecases/music/load-music';
import { DbLoadMusic } from '@/data/usecases/music/load-music/db-load-music';
import { MusicMongoRepository } from '@/infra/db/mongodb/music/music-mongo-repository';

export const makeDbLoadMusic = (): LoadMusic => {
  const musicMongoRepository = new MusicMongoRepository();
  return new DbLoadMusic(musicMongoRepository);
};
