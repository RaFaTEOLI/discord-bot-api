import { HttpClientSpy, mockLoadAccountByEmailRepository } from '@/data/test';
import { RemoteSpotifyRequestToken } from './remote-spotify-request-token';
import { mockSpotifyRequestTokenParams, mockSpotifyAccessModel } from '@/domain/test';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { SpotifyAccessModel } from '@/domain/models/spotify';
import { InvalidParamError } from '@/presentation/errors';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';

type SutTypes = {
  sut: RemoteSpotifyRequestToken;
  httpClientSpy: HttpClientSpy<SpotifyAccessModel>;
  httpClientSpotifySpy: HttpClientSpy<{ email: string }>;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<SpotifyAccessModel>();
  const httpClientSpotifySpy = new HttpClientSpy<{ email: string }>();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const sut = new RemoteSpotifyRequestToken(
    url,
    httpClientSpy,
    loadAccountByEmailRepositoryStub,
    httpClientSpotifySpy
  );
  return {
    sut,
    httpClientSpy,
    httpClientSpotifySpy,
    loadAccountByEmailRepositoryStub
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
      body: { email: faker.internet.email() }
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
      statusCode: HttpStatusCode.badRequest
    };
    const promise = sut.request(mockSpotifyRequestTokenParams());
    await expect(promise).rejects.toThrow(new InvalidParamError('client id'));
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
      body: { email: faker.internet.email() }
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
      body: { email: faker.internet.email() }
    };
    const promise = sut.request(mockSpotifyRequestTokenParams());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });
});
