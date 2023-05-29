import { AccountCleanModel } from '@/domain/models/account';

type AccountCleaned = Omit<AccountCleanModel, 'accessToken' | 'role'>;

type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type SaveAccountParams = Partial<AccountCleaned>;

export interface SaveAccount {
  save: (id: string, data: SaveAccountParams) => Promise<void>;
}
