import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { LoadQueueController } from '@/presentation/controllers/queue/load-queue/load-queue-controller';
import { makeDbLoadQueue } from '@/main/factories/usecases/queue/load-queue/db-load-queue-factory';

export const makeLoadQueueController = (): Controller => {
  return makeLogControllerDecorator(new LoadQueueController(makeDbLoadQueue()));
};
