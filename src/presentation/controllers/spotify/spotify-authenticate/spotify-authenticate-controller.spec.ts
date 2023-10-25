import { SpotifyAuthenticateController } from './spotify-authenticate-controller';
import { forbidden, serverError, success, unauthorized } from '@/presentation/helpers/http/http-helper';
import {
  mockAccountModel,
  mockAccountModelWithToken,
  mockSpotifyAccessModel,
  mockSpotifyRequestTokenParams
} from '@/domain/test';
import {
  mockAuthentication,
  mockAddAccount,
  mockSpotifyRequestToken,
  mockSpotifyLoadUser,
  mockSaveAccount
} from '@/presentation/test';
import {
  HttpRequest,
  SpotifyRequestToken,
  AddAccount,
  Authentication,
  SpotifyLoadUser,
  SaveAccount
} from './spotify-authenticate-controller-protocols';
import { SpotifyAccessModel } from '@/domain/models/spotify';
import { AccountModel } from '@/domain/models/account';
import { EmailInUseError } from '@/presentation/errors';
import { describe, test, expect, vi } from 'vitest';

const mockRequest = (): HttpRequest => ({
  body: mockSpotifyRequestTokenParams()
});

const mockRequestSignUp = (): HttpRequest => ({
  body: mockSpotifyRequestTokenParams(true)
});

interface SutTypes {
  sut: SpotifyAuthenticateController;
  spotifyRequestTokenStub: SpotifyRequestToken;
  addAccountStub: AddAccount;
  authenticationStub: Authentication;
  fakeAccessModel: SpotifyAccessModel;
  spotifyLoadUserStub: SpotifyLoadUser;
  fakeAccount: AccountModel;
  saveAccountStub: SaveAccount;
}

const makeSut = (fakeAccount = mockAccountModel()): SutTypes => {
  const addAccountStub = mockAddAccount(fakeAccount);
  const authenticationStub = mockAuthentication();
  const fakeAccessModel = mockSpotifyAccessModel();
  const spotifyRequestTokenStub = mockSpotifyRequestToken(fakeAccessModel);
  const spotifyLoadUserStub = mockSpotifyLoadUser(fakeAccount);
  const saveAccountStub = mockSaveAccount(fakeAccount);
  const sut = new SpotifyAuthenticateController(
    spotifyRequestTokenStub,
    spotifyLoadUserStub,
    addAccountStub,
    authenticationStub,
    saveAccountStub
  );
  return {
    sut,
    spotifyRequestTokenStub,
    addAccountStub,
    authenticationStub,
    fakeAccessModel,
    spotifyLoadUserStub,
    fakeAccount,
    saveAccountStub
  };
};

describe('SpotifyAuthenticate Controller', () => {
  test('should call SpotifyAuthenticate with correct values', async () => {
    const { sut, spotifyRequestTokenStub } = makeSut();
    const addSpy = vi.spyOn(spotifyRequestTokenStub, 'request');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 500 if SpotifyRequestToken throws an exception', async () => {
    const { sut, spotifyRequestTokenStub } = makeSut();
    vi.spyOn(spotifyRequestTokenStub, 'request').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 200 on success', async () => {
    const fakeAccountWithToken = mockAccountModelWithToken();
    const { sut, fakeAccount } = makeSut(fakeAccountWithToken);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(
      success({
        accessToken: 'any_token',
        user: {
          email: fakeAccount.email,
          id: fakeAccount.id,
          name: fakeAccount.name,
          spotify: fakeAccount.spotify
        }
      })
    );
  });

  test('should call SpotifyLoadUser with correct values if an accessModel is returned', async () => {
    const { sut, spotifyLoadUserStub, fakeAccessModel } = makeSut();
    const loadSpy = vi.spyOn(spotifyLoadUserStub, 'load');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith({
      accessToken: fakeAccessModel.access_token,
      refreshToken: fakeAccessModel.refresh_token,
      redirectUri: httpRequest.body.redirectUri
    });
  });

  test('should call AddAccount with correct values if redirectUri is signup and no user is found', async () => {
    const fakeAccount = Object.assign({}, mockAccountModel(), {
      id: 'NOT-FOUND'
    });
    const { sut, addAccountStub } = makeSut(fakeAccount);
    const addSpy = vi.spyOn(addAccountStub, 'add');
    const httpRequest = mockRequestSignUp();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      email: fakeAccount.email,
      name: fakeAccount.name,
      password: fakeAccount.password
    });
  });

  test('should return 400 if user is not found and redirectUri is not signup', async () => {
    const fakeAccount = Object.assign({}, mockAccountModel(), {
      id: 'NOT-FOUND'
    });
    const { sut } = makeSut(fakeAccount);
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized());
  });

  test('should return 403 if add account returns null', async () => {
    const fakeAccount = Object.assign({}, mockAccountModel(), {
      id: 'NOT-FOUND'
    });
    const { sut, addAccountStub } = makeSut(fakeAccount);
    vi.spyOn(addAccountStub, 'add').mockResolvedValueOnce(null);
    const httpRequest = mockRequestSignUp();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test('should call Authentication and return 200 on success', async () => {
    const fakeAccount = Object.assign({}, mockAccountModel(), {
      id: 'NOT-FOUND'
    });
    const { sut, authenticationStub } = makeSut(fakeAccount);
    const authSpy = vi.spyOn(authenticationStub, 'auth');
    const httpResponse = await sut.handle(mockRequestSignUp());
    expect(authSpy).toHaveBeenCalledWith({ email: fakeAccount.email, password: fakeAccount.password });
    expect(httpResponse).toEqual(
      success({
        accessToken: 'any_token',
        user: {
          email: fakeAccount.email,
          id: fakeAccount.id,
          name: fakeAccount.name,
          spotify: fakeAccount.spotify
        }
      })
    );
  });

  test('should call Authentication and return 200 on success with admin role', async () => {
    const fakeAccount = Object.assign({}, mockAccountModel(), {
      id: 'NOT-FOUND',
      role: 'admin'
    });
    const { sut, authenticationStub } = makeSut(fakeAccount);
    const authSpy = vi.spyOn(authenticationStub, 'auth');
    const httpResponse = await sut.handle(mockRequestSignUp());
    expect(authSpy).toHaveBeenCalledWith({ email: fakeAccount.email, password: fakeAccount.password });
    expect(httpResponse).toEqual(
      success({
        accessToken: 'any_token',
        user: {
          email: fakeAccount.email,
          id: fakeAccount.id,
          name: fakeAccount.name,
          role: fakeAccount.role,
          spotify: fakeAccount.spotify
        }
      })
    );
  });

  test('should return 200 on success with spotify', async () => {
    const fakeAccountWithToken = mockAccountModelWithToken(true);
    const { sut, fakeAccount } = makeSut(fakeAccountWithToken);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(
      success({
        accessToken: 'any_token',
        user: {
          email: fakeAccount.email,
          id: fakeAccount.id,
          name: fakeAccount.name,
          spotify: fakeAccount.spotify
        }
      })
    );
  });

  test('should return 200 on success with spotify signup', async () => {
    const fakeAccountWithToken = mockAccountModelWithToken(true);
    const { sut, fakeAccount } = makeSut(fakeAccountWithToken);
    const httpResponse = await sut.handle(mockRequestSignUp());
    expect(httpResponse).toEqual(
      success({
        accessToken: 'any_token',
        user: {
          email: fakeAccount.email,
          id: fakeAccount.id,
          name: fakeAccount.name,
          spotify: fakeAccount.spotify
        }
      })
    );
  });

  test('should return 200 on success with Discord linked user', async () => {
    const fakeAccountWithToken = mockAccountModelWithToken();
    const { sut, fakeAccount } = makeSut(fakeAccountWithToken);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(
      success({
        accessToken: 'any_token',
        user: {
          email: fakeAccount.email,
          id: fakeAccount.id,
          name: fakeAccount.name,
          spotify: fakeAccount.spotify,
          discord: fakeAccountWithToken.discord
        }
      })
    );
  });

  test('should call SaveAccount with spotify access model', async () => {
    const fakeAccountWithToken = mockAccountModelWithToken(true);
    const { sut, saveAccountStub } = makeSut(fakeAccountWithToken);
    const saveSpy = vi.spyOn(saveAccountStub, 'save');
    await sut.handle(mockRequest());
    expect(saveSpy).toHaveBeenCalledWith(fakeAccountWithToken.id, {
      spotify: fakeAccountWithToken.spotify
    });
  });
});
