import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { AddAccount } from '@/domain/usecases/account/add-account';
import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account';

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;
  const hasher = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  return new DbAddAccount(hasher, addAccountRepository, addAccountRepository);
};
