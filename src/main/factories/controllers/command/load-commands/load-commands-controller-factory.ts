import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadCommands } from '@/main/factories/usecases/command/load-commands/db-load-commands-factory';
import { LoadCommandsController } from '@/presentation/controllers/command/load-commands/load-commands-controller';

export const makeLoadCommandsController = (): Controller => {
  return makeLogControllerDecorator(new LoadCommandsController(makeDbLoadCommands()));
};
