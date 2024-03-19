import { LoadDiscordCommandsController } from './load-discord-commands-controller';
import { LoadDiscordCommands } from './load-discord-commands-protocols';
import { noContent, serverError } from '@/presentation/helpers/http/http-helper';
import { mockLoadDiscordCommands } from '@/presentation/test';
import MockDate from 'mockdate';
import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';

interface SutTypes {
  sut: LoadDiscordCommandsController;
  loadDiscordCommandsStub: LoadDiscordCommands;
}

const makeSut = (): SutTypes => {
  const loadDiscordCommandsStub = mockLoadDiscordCommands();
  const sut = new LoadDiscordCommandsController(loadDiscordCommandsStub);
  return {
    sut,
    loadDiscordCommandsStub
  };
};

describe('LoadDiscordCommands Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call LoadDiscordCommands', async () => {
    const { sut, loadDiscordCommandsStub } = makeSut();
    const loadSpy = vi.spyOn(loadDiscordCommandsStub, 'all');
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.length).toBe(3);
  });

  test('should return 204 if LoadDiscordCommands returns empty', async () => {
    const { sut, loadDiscordCommandsStub } = makeSut();
    vi.spyOn(loadDiscordCommandsStub, 'all').mockResolvedValue([]);
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });

  test('should return 500 if LoadDiscordCommands throws an exception', async () => {
    const { sut, loadDiscordCommandsStub } = makeSut();
    vi.spyOn(loadDiscordCommandsStub, 'all').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
