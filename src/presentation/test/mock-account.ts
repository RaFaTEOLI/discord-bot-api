import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account';
import { AccountModel } from '@/domain/models/account';
import { mockAccountModel } from '@/domain/test';
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication';

export const mockAddAccount = (fakeAccount = mockAccountModel()): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(fakeAccount);
    }
  }
  return new AddAccountStub();
};

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationParams): Promise<AccountModel> {
      return await Promise.resolve({ ...mockAccountModel(), accessToken: 'any_token' });
    }
  }
  return new AuthenticationStub();
};
