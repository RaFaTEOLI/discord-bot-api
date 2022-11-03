import env from '@/main/config/env';
import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JWTAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { Authentication } from '@/domain/usecases/account/authentication';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JWTAdapter(env.jwtSecret);
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository);
};
