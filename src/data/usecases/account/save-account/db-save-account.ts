import { SaveAccount, SaveAccountParams } from '@/domain/usecases/account/save-account';
import { SaveAccountRepository } from './db-save-account-protocols';

export class DbSaveAccount implements SaveAccount {
  constructor(private readonly saveAccountRepository: SaveAccountRepository) {}

  async save(id: string, data: SaveAccountParams): Promise<void> {
    await this.saveAccountRepository.save(id, data);
  }
}
