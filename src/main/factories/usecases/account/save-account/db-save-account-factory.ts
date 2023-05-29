import { SaveAccount } from '@/domain/usecases/account/save-account';
import { DbSaveAccount } from '@/data/usecases/account/save-account/db-save-account';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';

export const makeDbSaveAccount = (): SaveAccount => {
  const saveAccountMongoRepository = new AccountMongoRepository();
  return new DbSaveAccount(saveAccountMongoRepository);
};
