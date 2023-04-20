import { HttpClientSpy } from '@/data/test';
import { RemoteSpotifyRequestToken } from './remote-spotify-request-token';
import { mockSpotifyRequestTokenParams, mockSpotifyAccessModel } from '@/domain/test';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { SpotifyAccessModel } from '@/domain/models/spotify';
import { InvalidParamError } from '@/presentation/errors';

type SutTypes = {
  sut: RemoteSpotifyRequestToken;
  httpClientSpy: HttpClientSpy<SpotifyAccessModel>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<SpotifyAccessModel>();
  const sut = new RemoteSpotifyRequestToken(url, httpClientSpy);
  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteSpotifyRequestToken', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    const httpResult = mockSpotifyAccessModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
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

  test('should return an AccessModel if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockSpotifyAccessModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const accessModel = await sut.request(mockSpotifyRequestTokenParams());
    expect(accessModel.access_token).toBeTruthy();
    expect(accessModel.refresh_token).toBeTruthy();
  });

  test('should return an AccessModel when state is not provided', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockSpotifyAccessModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const spotifyRequestTokenParams = mockSpotifyRequestTokenParams();
    delete spotifyRequestTokenParams.state;
    const accessModel = await sut.request(spotifyRequestTokenParams);
    expect(accessModel.access_token).toBeTruthy();
    expect(accessModel.refresh_token).toBeTruthy();
  });
});
