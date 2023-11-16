import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeUpdateCommandValidation } from './update-command-validation-factory';
import { makeDbSaveCommand } from '@/main/factories/usecases/command/save-command/db-save-command-factory';
import { makeSocketClient } from '@/main/factories/http';
import { UpdateCommandController } from '@/presentation/controllers/command/update-command/update-command-controller';

export const makePatchUpdateCommandController = (): Controller => {
  return makeLogControllerDecorator(
    new UpdateCommandController(makeUpdateCommandValidation(), makeDbSaveCommand(), makeSocketClient())
  );
};
