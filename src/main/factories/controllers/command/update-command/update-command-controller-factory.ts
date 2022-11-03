import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { SaveCommandController } from '@/presentation/controllers/command/save-command/save-command-controller';
import { makeUpdateCommandValidation } from './update-command-validation-factory';
import { makeDbSaveCommand } from '@/main/factories/usecases/command/save-command/db-save-command-factory';

export const makeUpdateCommandController = (): Controller => {
  return makeLogControllerDecorator(new SaveCommandController(makeUpdateCommandValidation(), makeDbSaveCommand()));
};
