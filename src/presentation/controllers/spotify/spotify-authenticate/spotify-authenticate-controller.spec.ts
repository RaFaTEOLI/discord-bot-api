import { SpotifyAuthenticateController } from './spotify-authenticate-controller';
import { serverError, success } from '@/presentation/helpers/http/http-helper';
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

const mockRequest = (): HttpRequest => ({
  body: mockSpotifyRequestTokenParams()
});

interface SutTypes {
  sut: SpotifyAuthenticateController;
  spotifyRequestTokenStub: SpotifyRequestToken;
  addAccountStub: AddAccount;
  authenticationStub: Authentication;
  fakeAccessModel: SpotifyAccessModel;
  spotifyLoadUserStub: SpotifyLoadUser;
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount();
  const authenticationStub = mockAuthentication();
  const fakeAccessModel = mockSpotifyAccessModel();
  const spotifyRequestTokenStub = mockSpotifyRequestToken(fakeAccessModel);
  const fakeAccount = mockAccountModel();
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
    spotifyLoadUserStub
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
    const addSpy = jest.spyOn(spotifyLoadUserStub, 'load');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      accessToken: fakeAccessModel.access_token,
      refreshToken: fakeAccessModel.refresh_token,
      redirectUri: httpRequest.body.redirectUri
    });
  });
});
