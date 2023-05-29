import { AccountCleanModel, AccountModel } from '@/domain/models/account';

type AccountCleaned = Omit<AccountCleanModel, 'accessToken' | 'role'>;

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type SaveAccountParams = WithRequired<Partial<AccountCleaned>, 'id'>;

export interface SaveAccount {
  save: (data: SaveAccountParams) => Promise<AccountModel>;
}
