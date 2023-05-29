import { AccountModel } from '@/domain/models/account';
import { SaveAccountParams } from '@/domain/usecases/account/save-account';

export interface SaveAccountRepository {
  save: (data: SaveAccountParams) => Promise<AccountModel>;
}
