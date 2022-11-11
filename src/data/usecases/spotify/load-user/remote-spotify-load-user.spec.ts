import { HttpClientSpy, mockAddAccountRepository, mockLoadAccountByEmailRepository } from '@/data/test';
import { mockSpotifyLoadUserParams, mockSpotifyUserModel } from '@/domain/test';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { SpotifyUserModel } from '@/domain/models/spotify';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { RemoteSpotifyLoadUser } from './remote-spotify-load-user';

type SutTypes = {
  sut: RemoteSpotifyLoadUser;
  httpClientSpy: HttpClientSpy<SpotifyUserModel>;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  addAccountRepositoryStub: AddAccountRepository;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<SpotifyUserModel>();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const sut = new RemoteSpotifyLoadUser(
    url,
    httpClientSpy,
    loadAccountByEmailRepositoryStub,
    addAccountRepositoryStub
  );
  return {
    sut,
    httpClientSpy,
    loadAccountByEmailRepositoryStub,
    addAccountRepositoryStub
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

  test('should throw AccessDeniedError if user is not found', async () => {
    const { sut, httpClientSpy, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyUserModel()
    };
    const promise = sut.load(mockSpotifyLoadUserParams());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should create new user if user is not found and redirect uri is signup', async () => {
    const { sut, httpClientSpy, loadAccountByEmailRepositoryStub, addAccountRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null);
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyUserModel()
    };
    const loadUserParams = mockSpotifyLoadUserParams();
    const account = await sut.load(
      Object.assign({}, loadUserParams, { redirectUri: `${faker.internet.url()}/signup` })
    );
    expect(addSpy).toHaveBeenCalled();
    expect(account.email).toBeTruthy();
    expect(account.spotify.accessToken).toBeTruthy();
  });
});
