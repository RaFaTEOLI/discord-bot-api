import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadCommandById } from '@/main/factories/usecases/command/load-command-by-id/db-load-command-by-id-factory';
import { LoadCommandByIdController } from '@/presentation/controllers/command/load-command-by-id/load-command-by-id-controller';

export const makeLoadCommandByIdController = (): Controller => {
  return makeLogControllerDecorator(new LoadCommandByIdController(makeDbLoadCommandById()));
};
