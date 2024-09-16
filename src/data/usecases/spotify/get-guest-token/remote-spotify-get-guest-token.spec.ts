import { HttpClientSpy } from '@/data/test';
import { RemoteSpotifyGetGuestToken } from './remote-spotify-get-guest-token';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { SpotifyGuestTokenModel } from '@/domain/models/spotify';
import { describe, test, expect } from 'vitest';
import { mockSpotifyGuestTokenModel } from '@/domain/test/mock-spotify-get-guest-token';
import { CacheGetSpy, CacheSetSpy } from '@/data/test/mock-cache';

type SutTypes = {
  sut: RemoteSpotifyGetGuestToken;
  httpClientSpy: HttpClientSpy<SpotifyGuestTokenModel>;
  cacheGetSpy: CacheGetSpy;
  cacheSetSpy: CacheSetSpy;
};

type Overrides = {
  url?: string;
  cacheGetSpy?: CacheGetSpy;
  cacheSetSpy?: CacheSetSpy;
};

const makeSut = (overrides?: Overrides): SutTypes => {
  const httpClientSpy = new HttpClientSpy<SpotifyGuestTokenModel>();
  const cacheGetSpy = overrides?.cacheGetSpy ?? new CacheGetSpy();
  const cacheSetSpy = overrides?.cacheSetSpy ?? new CacheSetSpy();
  const sut = new RemoteSpotifyGetGuestToken(
    overrides?.url ?? faker.internet.url(),
    cacheGetSpy,
    cacheSetSpy,
    httpClientSpy
  );
  return {
    sut,
    httpClientSpy,
    cacheGetSpy,
    cacheSetSpy
  };
};

describe('RemoteSpotifyGetGuestToken', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut({ url });
    const httpResult = mockSpotifyGuestTokenModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    await sut.get();
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('get');
  });

  test('should throw InvalidCredentialsError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    };
    const promise = sut.get();
    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.get();
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.get();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.get();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return an GuestTokenModel if HttpClient returns 200 and store TokenModel in cache', async () => {
    const { sut, httpClientSpy, cacheSetSpy } = makeSut();
    const httpResult = mockSpotifyGuestTokenModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const accessModel = await sut.get();
    expect(accessModel.accessTokenExpirationTimestampMs).toBeTruthy();
    expect(accessModel.accessToken).toBeTruthy();
    expect(cacheSetSpy.callsCount).toBe(1);
    expect(cacheSetSpy.key).toBe('spotify-guest-token');
    expect(cacheSetSpy.value).toEqual(accessModel);
    expect(cacheSetSpy.ttl).toBe(3600);
  });

  test('should return an GuestTokenModel when state is not provided', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockSpotifyGuestTokenModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const accessModel = await sut.get();
    expect(accessModel.accessToken).toBeTruthy();
    expect(accessModel.accessTokenExpirationTimestampMs).toBeTruthy();
  });

  test('should call CacheGet with the correct key and return value if it exists', async () => {
    const spotifyGuestToken = mockSpotifyGuestTokenModel();
    const cacheGetSpy = new CacheGetSpy(spotifyGuestToken);
    const { sut } = makeSut({ cacheGetSpy });
    const response = await sut.get();
    expect(cacheGetSpy.callsCount).toBe(1);
    expect(cacheGetSpy.key).toBe('spotify-guest-token');
    expect(response).toEqual(cacheGetSpy.value);
  });
});
