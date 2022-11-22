import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbDeleteCommandById } from '@/main/factories/usecases/command/delete-command-by-id/db-delete-command-by-id-factory';
import { DeleteCommandByIdController } from '@/presentation/controllers/command/delete-command-by-id/delete-command-by-id-controller';

export const makeDeleteCommandByIdController = (): Controller => {
  return makeLogControllerDecorator(new DeleteCommandByIdController(makeDbDeleteCommandById()));
};
