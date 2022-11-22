import { DeleteCommandById, DeleteCommandByIdRepository } from './db-delete-command-by-id-protocols';

export class DbDeleteCommandById implements DeleteCommandById {
  constructor(private readonly deleteCommandRepository: DeleteCommandByIdRepository) {}

  async deleteById(id: string): Promise<boolean> {
    return await this.deleteCommandRepository.deleteById(id);
  }
}
