import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { LoadMusicController } from '@/presentation/controllers/music/load-music/load-music-controller';
import { makeDbLoadMusic } from '@/main/factories/usecases/music/load-music/db-load-music-factory';

export const makeLoadMusicController = (): Controller => {
  return makeLogControllerDecorator(new LoadMusicController(makeDbLoadMusic()));
};
