import { mockRemoteDiscordCommandListModel } from '@/data/test/mock-remote-discord-command-list';
import { RemoteLoadDiscordCommands } from '@/data/usecases/command/load-discord-commands/remote-load-discord-commands';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';
import { describe, test, expect } from 'vitest';
import { DiscordCommandModel } from '@/domain/models/discord-command-model';
import { HttpClientSpy } from '@/data/test';

type SutTypes = {
  sut: RemoteLoadDiscordCommands;
  httpClientSpy: HttpClientSpy<DiscordCommandModel[]>;
  botToken: string;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<DiscordCommandModel[]>();
  const botToken = faker.datatype.uuid();
  const sut = new RemoteLoadDiscordCommands(url, httpClientSpy, botToken);
  return {
    sut,
    httpClientSpy,
    botToken
  };
};

describe('RemoteLoadDiscordCommands', () => {
  test('should call HttpClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy, botToken } = makeSut(url);
    await sut.all();
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('get');
    expect(httpClientSpy.headers).toEqual({ Authorization: `Bot ${botToken}` });
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.all();
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.all();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.all();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return a list of CommandModels if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockRemoteDiscordCommandListModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const commandList = await sut.all();
    expect(commandList).toEqual(httpResult);
  });

  test('should return an empty list of LoadDiscordCommands.Model if HttpClient returns 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const commandList = await sut.all();
    expect(commandList).toEqual([]);
  });
});
