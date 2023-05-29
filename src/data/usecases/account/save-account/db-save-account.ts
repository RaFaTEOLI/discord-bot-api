import { SaveAccount, SaveAccountParams } from '@/domain/usecases/account/save-account';
import { SaveAccountRepository, AccountModel } from './db-save-account-protocols';

export class DbSaveAccount implements SaveAccount {
  constructor(private readonly saveAccountRepository: SaveAccountRepository) {}

  async save(data: SaveAccountParams): Promise<AccountModel> {
    const account = await this.saveAccountRepository.save(data);
    return account;
  }
}
