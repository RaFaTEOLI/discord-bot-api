import { SaveAccountParams } from '@/domain/usecases/account/save-account';

export interface SaveAccountRepository {
  save: (id: string, data: SaveAccountParams) => Promise<void>;
}
