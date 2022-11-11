import { SpotifyAuthenticateController } from './spotify-authenticate-controller';
import { serverError, success, unauthorized } from '@/presentation/helpers/http/http-helper';
import { mockAccountModel, mockSpotifyAccessModel, mockSpotifyRequestTokenParams } from '@/domain/test';
import {
  mockAuthentication,
  mockAddAccount,
  mockSpotifyRequestToken,
  mockSpotifyLoadUser
} from '@/presentation/test';
import {
  HttpRequest,
  SpotifyRequestToken,
  AddAccount,
  Authentication,
  SpotifyLoadUser
} from './spotify-authenticate-controller-protocols';
import { SpotifyAccessModel } from '@/domain/models/spotify';
import { AccountModel } from '@/domain/models/account';

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
}

const makeSut = (fakeAccount = mockAccountModel()): SutTypes => {
  const addAccountStub = mockAddAccount();
  const authenticationStub = mockAuthentication();
  const fakeAccessModel = mockSpotifyAccessModel();
  const spotifyRequestTokenStub = mockSpotifyRequestToken(fakeAccessModel);
  const spotifyLoadUserStub = mockSpotifyLoadUser(fakeAccount);
  const sut = new SpotifyAuthenticateController(
    spotifyRequestTokenStub,
    spotifyLoadUserStub,
    addAccountStub,
    authenticationStub
  );
  return {
    sut,
    spotifyRequestTokenStub,
    addAccountStub,
    authenticationStub,
    fakeAccessModel,
    spotifyLoadUserStub,
    fakeAccount
  };
};

describe('SpotifyAuthenticate Controller', () => {
  test('should call SpotifyAuthenticate with correct values', async () => {
    const { sut, spotifyRequestTokenStub } = makeSut();
    const addSpy = jest.spyOn(spotifyRequestTokenStub, 'request');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 500 if SpotifyRequestToken throws an exception', async () => {
    const { sut, spotifyRequestTokenStub } = makeSut();
    jest.spyOn(spotifyRequestTokenStub, 'request').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 200 on success', async () => {
    const { sut, fakeAccessModel } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(success(fakeAccessModel));
  });

  test('should call SpotifyLoadUser with correct values if an accessModel is returned', async () => {
    const { sut, spotifyLoadUserStub, fakeAccessModel } = makeSut();
    const loadSpy = jest.spyOn(spotifyLoadUserStub, 'load');
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
    const addSpy = jest.spyOn(addAccountStub, 'add');
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
});
