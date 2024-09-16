import { SpotifyGetGuestTokenController } from './spotify-get-guest-token-controller';
import { serverError, success } from '@/presentation/helpers/http/http-helper';
import { mockSpotifyGetGuestToken } from '@/presentation/test';
import { SpotifyGetGuestToken } from './spotify-get-guest-token-controller-protocols';
import { describe, test, expect, vi } from 'vitest';
import { mockSpotifyGuestTokenModel } from '@/domain/test/mock-spotify-get-guest-token';

interface SutTypes {
  sut: SpotifyGetGuestTokenController;
  spotifyGetGuestTokenStub: SpotifyGetGuestToken;
}

const makeSut = (guestTokenModel = mockSpotifyGuestTokenModel()): SutTypes => {
  const spotifyGetGuestTokenStub = mockSpotifyGetGuestToken(guestTokenModel);
  const sut = new SpotifyGetGuestTokenController(spotifyGetGuestTokenStub);
  return {
    sut,
    spotifyGetGuestTokenStub
  };
};

describe('SpotifyGetGuestToken Controller', () => {
  test('should call SpotifyGetGuestToken with correct values', async () => {
    const { sut, spotifyGetGuestTokenStub } = makeSut();
    const getGuestTokenSpy = vi.spyOn(spotifyGetGuestTokenStub, 'get');
    await sut.handle({});
    expect(getGuestTokenSpy).toHaveBeenCalled();
  });

  test('should return 500 if SpotifyGetGuestToken throws an exception', async () => {
    const { sut, spotifyGetGuestTokenStub } = makeSut();
    vi.spyOn(spotifyGetGuestTokenStub, 'get').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 200 on success', async () => {
    const guestTokenModel = mockSpotifyGuestTokenModel();
    const { sut } = makeSut(guestTokenModel);
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(
      success({
        accessToken: guestTokenModel.accessToken,
        expiresAt: guestTokenModel.accessTokenExpirationTimestampMs
      })
    );
  });
});
