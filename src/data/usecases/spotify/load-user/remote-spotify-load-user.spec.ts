import { HttpClientSpy, mockLoadAccountByEmailRepository } from '@/data/test';
import { mockSpotifyLoadUserParams, mockSpotifyUserModel } from '@/domain/test';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { SpotifyUserModel } from '@/domain/models/spotify';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { RemoteSpotifyLoadUser } from './remote-spotify-load-user';
import { describe, test, expect, vi } from 'vitest';

type SutTypes = {
  sut: RemoteSpotifyLoadUser;
  httpClientSpy: HttpClientSpy<SpotifyUserModel>;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<SpotifyUserModel>();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const sut = new RemoteSpotifyLoadUser(url, httpClientSpy, loadAccountByEmailRepositoryStub);
  return {
    sut,
    httpClientSpy,
    loadAccountByEmailRepositoryStub
  };
};

describe('RemoteSpotifyLoadUser', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyUserModel()
    };
    const loadUserParams = mockSpotifyLoadUserParams();
    await sut.load(loadUserParams);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('get');
  });

  test('should throw InvalidCredentialsError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    };
    const promise = sut.load(mockSpotifyLoadUserParams());
    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });

  test('should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    };
    const promise = sut.load(mockSpotifyLoadUserParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.load(mockSpotifyLoadUserParams());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.load(mockSpotifyLoadUserParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.load(mockSpotifyLoadUserParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return an AccountModel if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyUserModel()
    };
    const account = await sut.load(mockSpotifyLoadUserParams());
    expect(account.email).toBeTruthy();
    expect(account.spotify.accessToken).toBeTruthy();
  });

  test('should return an AccountModel with id as NOT-FOUND if HttpClient returns 200 and user is not found', async () => {
    const { sut, httpClientSpy, loadAccountByEmailRepositoryStub } = makeSut();
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyUserModel()
    };
    const account = await sut.load(mockSpotifyLoadUserParams());
    expect(account.id).toBe('NOT-FOUND');
    expect(account.email).toBeTruthy();
    expect(account.spotify.accessToken).toBeTruthy();
  });
});
