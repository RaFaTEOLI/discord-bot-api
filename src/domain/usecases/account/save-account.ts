import { AccountModel } from '@/domain/models/account';

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type SaveAccountParams = WithRequired<Partial<AccountModel>, 'id'>;

export interface SaveAccount {
  save: (data: SaveAccountParams) => Promise<AccountModel>;
}
