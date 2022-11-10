import { HttpRequest, SpotifyRequestToken } from './spotify-request-token-controller-protocols';
import { SpotifyRequestTokenController } from './spotify-request-token-controller';
import { serverError, success } from '@/presentation/helpers/http/http-helper';
import { mockAccountModel, mockSpotifyRequestTokenParams } from '@/domain/test';
import { mockSpotifyRequestToken } from '@/presentation/test';

const mockRequest = (): HttpRequest => ({
  body: mockSpotifyRequestTokenParams()
});

interface SutTypes {
  sut: SpotifyRequestTokenController;
  spotifyRequestTokenStub: SpotifyRequestToken;
}

const makeSut = (): SutTypes => {
  const spotifyRequestTokenStub = mockSpotifyRequestToken();
  const sut = new SpotifyRequestTokenController(spotifyRequestTokenStub);
  return {
    sut,
    spotifyRequestTokenStub
  };
};

describe('SpotifyRequestToken Controller', () => {
  test('should call SpotifyRequestToken with correct values', async () => {
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
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(success(mockAccountModel()));
  });
});
