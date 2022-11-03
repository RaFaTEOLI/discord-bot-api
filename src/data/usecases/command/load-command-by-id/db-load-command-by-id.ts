import { CommandModel, LoadCommandById, LoadCommandByIdRepository } from './db-load-command-by-id-protocols';

export class DbLoadCommandById implements LoadCommandById {
  constructor(private readonly loadCommandRepository: LoadCommandByIdRepository) {}

  async loadById(id: string): Promise<CommandModel> {
    const command = await this.loadCommandRepository.loadById(id);
    return command;
  }
}
