import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { AccountModel } from '@/domain/models/account';
import { mockAccountModel } from '@/domain/test';
import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { SaveAccountRepository } from '@/data/protocols/db/account/save-account-repository';
import { SaveAccountParams } from '@/data/usecases/account/save-account/db-save-account-protocols';

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel());
    }
  }
  return new AddAccountRepositoryStub();
};

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel());
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(accessToken: string, role?: string): Promise<AccountModel | null> {
      return await Promise.resolve(mockAccountModel());
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return await Promise.resolve();
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

export const mockSaveAccountRepository = (fakeAccount = mockAccountModel()): SaveAccountRepository => {
  class SaveAccountRepositoryStub implements SaveAccountRepository {
    async save(data: SaveAccountParams): Promise<AccountModel> {
      return await Promise.resolve(fakeAccount);
    }
  }
  return new SaveAccountRepositoryStub();
};
