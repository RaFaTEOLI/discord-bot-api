import { CommandMongoRepository } from '@/infra/db/mongodb/command/command-mongo-repository';
import { LoadCommandByName } from '@/domain/usecases/command/load-command-by-name';
import { DbLoadCommandByName } from '@/data/usecases/command/load-command-by-name/db-load-command-by-name';

export const makeDbLoadCommandByName = (): LoadCommandByName => {
  const commandMongoRepository = new CommandMongoRepository();
  return new DbLoadCommandByName(commandMongoRepository);
};
