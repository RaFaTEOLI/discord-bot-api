import { AxiosHttpClient } from './axios-http-client';
import { mockAxios, mockHttpResponse } from '@/infra/test';
import { mockHttpRequest } from '@/data/test';
import axios from 'axios';
import { describe, test, expect, vi, MockedObject } from 'vitest';

vi.mock('axios');

type SutTypes = {
  sut: AxiosHttpClient;
  mockedAxios: MockedObject<typeof axios>;
};

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient();
  const mockedAxios = mockAxios();
  return {
    sut,
    mockedAxios
  };
};

describe('AxiosHttpClient', () => {
  test('should call axios with correct values', async () => {
    const request = mockHttpRequest();
    const { sut, mockedAxios } = makeSut();
    await sut.request(request);
    expect(mockedAxios.request).toHaveBeenCalledWith({
      url: request.url,
      data: request.body,
      headers: request.headers,
      method: request.method
    });
  });

  test('should return correct response', async () => {
    const { sut, mockedAxios } = makeSut();
    const httpResponse = await sut.request(mockHttpRequest());
    const axiosResponse = await mockedAxios.request.mock.results[0].value;
    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    });
  });

  test('should return correct error', () => {
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockRejectedValueOnce({
      response: mockHttpResponse()
    });
    const promise = sut.request(mockHttpRequest());
    expect(promise).toEqual(mockedAxios.request.mock.results[0].value);
  });

  test('should return unable to connect error', () => {
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockRejectedValueOnce({
      code: 'ECONNREFUSED'
    });
    const promise = sut.request(mockHttpRequest());
    expect(promise).toEqual(mockedAxios.request.mock.results[0].value);
  });

  test('should return unable to connect error', () => {
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockRejectedValueOnce({
      code: 'ERR_NETWORK'
    });
    const promise = sut.request(mockHttpRequest());
    expect(promise).toEqual(mockedAxios.request.mock.results[0].value);
  });
});
