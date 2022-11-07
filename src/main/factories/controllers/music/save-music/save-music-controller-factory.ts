import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { SaveMusicController } from '@/presentation/controllers/music/save-music/save-music-controller';
import { makeDbSaveMusic } from '@/main/factories/usecases/music/save-music/db-save-music-factory';

export const makeSaveMusicController = (): Controller => {
  return makeLogControllerDecorator(new SaveMusicController(makeDbSaveMusic()));
};
