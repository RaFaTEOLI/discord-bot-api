import { CommandModel, LoadCommandByName, LoadCommandByNameRepository } from './db-load-command-by-name-protocols';

export class DbLoadCommandByName implements LoadCommandByName {
  constructor(private readonly loadCommandRepository: LoadCommandByNameRepository) {}

  async loadByName(commandName: string): Promise<CommandModel> {
    const command = await this.loadCommandRepository.loadByName(commandName);
    return command;
  }
}
