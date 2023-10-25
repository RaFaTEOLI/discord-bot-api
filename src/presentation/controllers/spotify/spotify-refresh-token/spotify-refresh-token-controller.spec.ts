import { SpotifyRefreshTokenController } from './spotify-refresh-token-controller';
import { serverError, success } from '@/presentation/helpers/http/http-helper';
import {
  mockAccountModel,
  mockAccountModelWithToken,
  mockSpotifyAccessModel,
  mockSpotifyRefreshTokenParams
} from '@/domain/test';
import { mockSpotifyRefreshToken, mockSaveAccount } from '@/presentation/test';
import {
  HttpRequest,
  SaveAccount,
  SpotifyRefreshToken,
  SpotifyAccessModel,
  AccountModel
} from './spotify-refresh-token-controller-protocols';
import { describe, test, expect, vi } from 'vitest';

const mockRequest = (): HttpRequest => ({
  body: mockSpotifyRefreshTokenParams(),
  account: mockAccountModel()
});

interface SutTypes {
  sut: SpotifyRefreshTokenController;
  spotifyRefreshTokenStub: SpotifyRefreshToken;
  saveAccountStub: SaveAccount;
  fakeAccessModel: SpotifyAccessModel;
  fakeAccount: AccountModel;
}

const makeSut = (fakeAccount = mockAccountModel()): SutTypes => {
  const fakeAccessModel = mockSpotifyAccessModel();
  const spotifyRefreshTokenStub = mockSpotifyRefreshToken(fakeAccessModel);
  const saveAccountStub = mockSaveAccount(fakeAccount);
  const sut = new SpotifyRefreshTokenController(spotifyRefreshTokenStub, saveAccountStub);
  return {
    sut,
    spotifyRefreshTokenStub,
    fakeAccessModel,
    fakeAccount,
    saveAccountStub
  };
};

describe('SpotifyRefreshToken Controller', () => {
  test('should call SpotifyRefreshToken with correct values', async () => {
    const { sut, spotifyRefreshTokenStub } = makeSut();
    const refreshSpy = vi.spyOn(spotifyRefreshTokenStub, 'refresh');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(refreshSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 500 if SpotifyRefreshToken throws an exception', async () => {
    const { sut, spotifyRefreshTokenStub } = makeSut();
    vi.spyOn(spotifyRefreshTokenStub, 'refresh').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 200 on success', async () => {
    const fakeAccountWithToken = mockAccountModelWithToken();
    const { sut, fakeAccessModel, saveAccountStub } = makeSut(fakeAccountWithToken);
    const saveSpy = vi.spyOn(saveAccountStub, 'save');
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(
      success({
        accessToken: fakeAccessModel.access_token
      })
    );
    expect(saveSpy).toHaveBeenCalledWith(fakeAccountWithToken.id, {
      spotify: { accessToken: fakeAccessModel.access_token }
    });
  });
});
