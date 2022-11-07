import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { SaveQueueController } from '@/presentation/controllers/queue/save-queue/save-queue-controller';
import { makeSaveQueueValidation } from './save-queue-validation-factory';
import { makeDbSaveQueue } from '@/main/factories/usecases/queue/save-queue/db-save-queue-factory';

export const makeSaveQueueController = (): Controller => {
  return makeLogControllerDecorator(new SaveQueueController(makeSaveQueueValidation(), makeDbSaveQueue()));
};
