import { CommandMongoRepository } from '@/infra/db/mongodb/command/command-mongo-repository';
import { DeleteCommandById } from '@/domain/usecases/command/delete-command-by-id';
import { DbDeleteCommandById } from '@/data/usecases/command/delete-command-by-id/db-delete-command-by-id';

export const makeDbDeleteCommandById = (): DeleteCommandById => {
  const commandMongoRepository = new CommandMongoRepository();
  return new DbDeleteCommandById(commandMongoRepository);
};
