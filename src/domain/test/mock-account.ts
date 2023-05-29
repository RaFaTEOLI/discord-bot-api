import { AccountModel, AccountCleanModel } from '@/domain/models/account';
import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { AuthenticationParams } from '@/domain/usecases/account/authentication';
import { faker } from '@faker-js/faker';

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

export const mockAccountModelWithToken = (spotifyToken?: boolean): AccountModel =>
  Object.assign({}, mockAddAccountParams(), {
    id: 'any_id',
    password: 'hashed_password',
    accessToken: 'any_token',
    ...(spotifyToken && { spotify: { accessToken: faker.datatype.uuid(), refreshToken: faker.datatype.uuid() } })
  });

export const mockAccountModelWithSpotifyAndDiscord = (): AccountModel => {
  const mockAccount = Object.assign({}, mockAddAccountParams(), {
    id: 'any_id',
    spotify: { accessToken: faker.datatype.uuid(), refreshToken: faker.datatype.uuid() },
    discord: {
      id: faker.datatype.uuid(),
      username: faker.internet.userName(),
      avatar: faker.internet.avatar(),
      discriminator: '0000'
    }
  });
  delete mockAccount.password;
  return mockAccount;
};

export const mockAccountModelReturn = (): AccountCleanModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com'
});

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});
