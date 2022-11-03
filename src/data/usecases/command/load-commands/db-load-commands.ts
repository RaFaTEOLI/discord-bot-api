import { CommandModel, LoadCommands, LoadCommandsRepository } from './db-load-commands-protocols';

export class DbLoadCommands implements LoadCommands {
  constructor(private readonly loadCommandsRepository: LoadCommandsRepository) {}

  async load(): Promise<CommandModel[]> {
    const commands = await this.loadCommandsRepository.loadAll();
    return commands;
  }
}
