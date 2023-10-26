import { HttpRequest, Validation, SaveCommand } from './save-command-controller-protocols';
import { SaveCommandController } from './save-command-controller';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { mockValidation, mockSaveCommand, mockSocketClient } from '@/presentation/test';
import { mockSaveCommandParams } from '@/domain/test';
import { InvalidParamError } from '@/presentation/errors';
import { Socket } from 'socket.io-client';
import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';
import { faker } from '@faker-js/faker';

const mockRequest = (): HttpRequest => ({
  body: mockSaveCommandParams()
});

const mockRequestWithCommandId = (): HttpRequest => ({
  body: mockSaveCommandParams(),
  params: {
    commandId: faker.datatype.uuid()
  }
});

interface SutTypes {
  sut: SaveCommandController;
  validationStub: Validation;
  saveCommandStub: SaveCommand;
  socketClientStub: Socket;
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const saveCommandStub = mockSaveCommand();
  const socketClientStub = mockSocketClient();
  const sut = new SaveCommandController(validationStub, saveCommandStub, socketClientStub);
  return {
    sut,
    validationStub,
    saveCommandStub,
    socketClientStub
  };
};

describe('SaveCommand Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = vi.spyOn(validationStub, 'validate');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test('should return 400 if save command returns null', async () => {
    const { sut, saveCommandStub } = makeSut();
    vi.spyOn(saveCommandStub, 'save').mockResolvedValueOnce(null);
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('command')));
  });

  test('should call SaveCommand with correct values', async () => {
    const { sut, saveCommandStub } = makeSut();
    const addSpy = vi.spyOn(saveCommandStub, 'save');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should call SaveCommand with correct values and commandId', async () => {
    const { sut, saveCommandStub } = makeSut();
    const addSpy = vi.spyOn(saveCommandStub, 'save');
    const httpRequest = mockRequestWithCommandId();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({ id: httpRequest.params.commandId, ...httpRequest.body });
  });

  test('should return 500 if SaveCommand throws an exception', async () => {
    const { sut, saveCommandStub } = makeSut();
    vi.spyOn(saveCommandStub, 'save').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test('should emit socket event on success', async () => {
    const { sut, socketClientStub, saveCommandStub } = makeSut();
    const socketSpy = vi.spyOn(socketClientStub, 'emit');
    const request = mockRequest();
    vi.spyOn(saveCommandStub, 'save').mockResolvedValueOnce({ id: faker.datatype.uuid(), ...request.body });
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(noContent());
    expect(socketSpy).toHaveBeenCalledWith('command', {
      name: request.body.command,
      type: request.body.discordType,
      description: request.body.description,
      ...(request.body.options && { options: request.body.options })
    });
  });
});
