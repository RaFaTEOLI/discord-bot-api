import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbDeleteCommandById } from '@/main/factories/usecases/command/delete-command-by-id/db-delete-command-by-id-factory';
import { DeleteCommandByIdController } from '@/presentation/controllers/command/delete-command-by-id/delete-command-by-id-controller';
import { makeDbLoadCommandById } from '@/main/factories/usecases/command/load-command-by-id/db-load-command-by-id-factory';
import { makeAmqpClient, useApiQueueFactory } from '@/main/factories/queue';

export const makeDeleteCommandByIdController = (): Controller => {
  return makeLogControllerDecorator(
    new DeleteCommandByIdController(
      makeDbLoadCommandById(),
      makeDbDeleteCommandById(),
      makeAmqpClient(),
      useApiQueueFactory()
    )
  );
};
