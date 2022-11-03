import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token';
import { JWTAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter';
import env from '@/main/config/env';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JWTAdapter(env.jwtSecret);
  const addAccountRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(jwtAdapter, addAccountRepository);
};
