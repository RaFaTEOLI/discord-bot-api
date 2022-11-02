import { AccountModel, AccountCleanModel } from '@/domain/models/account';
import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { AuthenticationParams } from '@/domain/usecases/account/authentication';

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
});

export const mockAccountModel = (): AccountModel =>
  Object.assign({}, mockAddAccountParams(), {
    id: 'any_id',
    password: 'hashed_password'
  });

export const mockAccountModelReturn = (): AccountCleanModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com'
});

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});
