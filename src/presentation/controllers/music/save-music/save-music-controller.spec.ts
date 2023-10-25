import { HttpRequest, SaveMusic } from './save-music-controller-protocols';
import { SaveMusicController } from './save-music-controller';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { mockSaveMusic, mockSocketClient } from '@/presentation/test';
import { mockSaveMusicParams } from '@/domain/test';
import { InvalidParamError } from '@/presentation/errors';
import { Socket } from 'socket.io-client';
import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';

const mockRequest = (): HttpRequest => ({
  body: mockSaveMusicParams()
});

interface SutTypes {
  sut: SaveMusicController;
  saveMusicStub: SaveMusic;
  socketClientStub: Socket;
}

const makeSut = (): SutTypes => {
  const saveMusicStub = mockSaveMusic();
  const socketClientStub = mockSocketClient();
  const sut = new SaveMusicController(saveMusicStub, socketClientStub);
  return {
    sut,
    saveMusicStub,
    socketClientStub
  };
};

describe('SaveMusic Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = { body: { duration: null } };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('name')));
  });

  test('should return 400 if no duration is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = { body: { name: null } };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('duration')));
  });

  test('should call SaveMusic with correct values', async () => {
    const { sut, saveMusicStub } = makeSut();
    const addSpy = vi.spyOn(saveMusicStub, 'save');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 500 if SaveMusic throws an exception', async () => {
    const { sut, saveMusicStub } = makeSut();
    vi.spyOn(saveMusicStub, 'save').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test('should emit socket event on success', async () => {
    const { sut, socketClientStub } = makeSut();
    const socketSpy = vi.spyOn(socketClientStub, 'emit');
    const request = mockRequest();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(noContent());
    expect(socketSpy).toHaveBeenCalledWith('music', {
      name: request.body.name,
      duration: request.body.duration
    });
  });
});
