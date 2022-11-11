import { HttpClientSpy, mockAddAccountRepository, mockLoadAccountByEmailRepository } from '@/data/test';
import { RemoteSpotifyRequestToken } from './remote-spotify-request-token';
import { mockSpotifyRequestTokenParams, mockSpotifyAccessModel, mockSpotifyUserModel } from '@/domain/test';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { SpotifyAccessModel, SpotifyUserModel } from '@/domain/models/spotify';
import { InvalidParamError } from '@/presentation/errors';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';

type SutTypes = {
  sut: RemoteSpotifyRequestToken;
  httpClientSpy: HttpClientSpy<SpotifyAccessModel>;
  httpClientSpotifySpy: HttpClientSpy<SpotifyUserModel>;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  addAccountRepositoryStub: AddAccountRepository;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<SpotifyAccessModel>();
  const httpClientSpotifySpy = new HttpClientSpy<SpotifyUserModel>();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const sut = new RemoteSpotifyRequestToken(
    url,
    httpClientSpy,
    loadAccountByEmailRepositoryStub,
    httpClientSpotifySpy,
    addAccountRepositoryStub
  );
  return {
    sut,
    httpClientSpy,
    httpClientSpotifySpy,
    loadAccountByEmailRepositoryStub,
    addAccountRepositoryStub
  };
};

describe('RemoteSpotifyRequestToken', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy, httpClientSpotifySpy } = makeSut(url);
    const httpResult = mockSpotifyAccessModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    httpClientSpotifySpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyUserModel()
    };
    const requestTokenParams = mockSpotifyRequestTokenParams();
    await sut.request(requestTokenParams);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('post');
    expect(httpClientSpy.body).toBeTruthy();
  });

  test('should throw InvalidCredentialsError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    };
    const promise = sut.request(mockSpotifyRequestTokenParams());
    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });

  test('should throw InvalidParamError if HttpClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
      body: {
        error: 'invalid_grant',
        error_description: 'Invalid authorization code'
      } as any
    };
    const promise = sut.request(mockSpotifyRequestTokenParams());
    await expect(promise).rejects.toThrow(new InvalidParamError('grant'));
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.request(mockSpotifyRequestTokenParams());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.request(mockSpotifyRequestTokenParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.request(mockSpotifyRequestTokenParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return an AccountModel if HttpClient returns 200', async () => {
    const { sut, httpClientSpy, httpClientSpotifySpy } = makeSut();
    const httpResult = mockSpotifyAccessModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    httpClientSpotifySpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyUserModel()
    };
    const account = await sut.request(mockSpotifyRequestTokenParams());
    expect(account.email).toBeTruthy();
    expect(account.spotify.accessToken).toBeTruthy();
  });

  test('should throw AccessDeniedError if user is not found', async () => {
    const { sut, httpClientSpy, httpClientSpotifySpy, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null);
    const httpResult = mockSpotifyAccessModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    httpClientSpotifySpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyUserModel()
    };
    const promise = sut.request(mockSpotifyRequestTokenParams());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should create new user if user is not found and redirect uri is signup', async () => {
    const {
      sut,
      httpClientSpy,
      httpClientSpotifySpy,
      loadAccountByEmailRepositoryStub,
      addAccountRepositoryStub
    } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null);
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const httpResult = mockSpotifyAccessModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    httpClientSpotifySpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyUserModel()
    };
    const requestTokenParams = mockSpotifyRequestTokenParams();
    const account = await sut.request(
      Object.assign({}, requestTokenParams, { redirectUri: `${faker.internet.url()}/signup` })
    );
    expect(addSpy).toHaveBeenCalled();
    expect(account.email).toBeTruthy();
    expect(account.spotify.accessToken).toBeTruthy();
  });
});
