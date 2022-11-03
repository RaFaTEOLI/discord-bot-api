import { CommandMongoRepository } from '@/infra/db/mongodb/command/command-mongo-repository';
import { LoadCommandById } from '@/domain/usecases/command/load-command-by-id';
import { DbLoadCommandById } from '@/data/usecases/command/load-command-by-id/db-load-command-by-id';

export const makeDbLoadCommandById = (): LoadCommandById => {
  const commandMongoRepository = new CommandMongoRepository();
  return new DbLoadCommandById(commandMongoRepository);
};
