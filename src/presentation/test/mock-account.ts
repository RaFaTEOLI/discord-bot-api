import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account';
import { AccountModel } from '@/domain/models/account';
import { mockAccountModel, mockAccountModelWithSpotifyAndDiscord } from '@/domain/test';
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication';
import { SaveAccount, SaveAccountParams } from '@/domain/usecases/account/save-account';

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

export const mockSaveAccount = (fakeAccount = mockAccountModelWithSpotifyAndDiscord()): SaveAccount => {
  class SaveAccountStub implements SaveAccount {
    async save(id: string, account: SaveAccountParams): Promise<void> {
      await Promise.resolve();
    }
  }
  return new SaveAccountStub();
};
