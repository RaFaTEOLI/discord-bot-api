import { SaveCommand } from '@/domain/usecases/command/save-command';
import { DbSaveCommand } from '@/data/usecases/command/save-command/db-save-command';
import { CommandMongoRepository } from '@/infra/db/mongodb/command/command-mongo-repository';
import { makeAmqpClient, useApiQueueFactory } from '@/main/factories/queue';

export const makeDbSaveCommand = (): SaveCommand => {
  const commandMongoRepository = new CommandMongoRepository();
  return new DbSaveCommand(commandMongoRepository, commandMongoRepository, makeAmqpClient(), useApiQueueFactory());
};
