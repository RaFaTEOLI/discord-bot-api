import { LoadCommands } from '@/domain/usecases/command/load-commands';
import { DbLoadCommands } from '@/data/usecases/command/load-commands/db-load-commands';
import { CommandMongoRepository } from '@/infra/db/mongodb/command/command-mongo-repository';

export const makeDbLoadCommands = (): LoadCommands => {
  const commandMongoRepository = new CommandMongoRepository();
  return new DbLoadCommands(commandMongoRepository);
};
