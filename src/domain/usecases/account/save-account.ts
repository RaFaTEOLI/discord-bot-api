import { AccountModel } from '@/domain/models/account';

type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type SaveAccountParams = Partial<AccountModel>;

export interface SaveAccount {
  save: (data: SaveAccountParams) => Promise<AccountModel>;
}
