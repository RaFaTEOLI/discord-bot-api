import { HttpRequest, Validation, UpdateCommand } from './update-command-controller-protocols';
import { UpdateCommandController } from './update-command-controller';
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
  sut: UpdateCommandController;
  validationStub: Validation;
  updateCommandStub: UpdateCommand;
  socketClientStub: Socket;
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const updateCommandStub = mockSaveCommand();
  const socketClientStub = mockSocketClient();
  const sut = new UpdateCommandController(validationStub, updateCommandStub, socketClientStub);
  return {
    sut,
    validationStub,
    updateCommandStub,
    socketClientStub
  };
};

describe('UpdateCommand Controller', () => {
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
    const { sut, updateCommandStub } = makeSut();
    vi.spyOn(updateCommandStub, 'save').mockResolvedValueOnce(null);
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('command')));
  });

  test('should call UpdateCommand with correct values', async () => {
    const { sut, updateCommandStub } = makeSut();
    const addSpy = vi.spyOn(updateCommandStub, 'save');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should call UpdateCommand with correct values and commandId', async () => {
    const { sut, updateCommandStub } = makeSut();
    const addSpy = vi.spyOn(updateCommandStub, 'save');
    const httpRequest = mockRequestWithCommandId();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({ id: httpRequest.params.commandId, ...httpRequest.body });
  });

  test('should return 500 if UpdateCommand throws an exception', async () => {
    const { sut, updateCommandStub } = makeSut();
    vi.spyOn(updateCommandStub, 'save').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test('should emit socket event on success', async () => {
    const { sut, socketClientStub, updateCommandStub } = makeSut();
    const socketSpy = vi.spyOn(socketClientStub, 'emit');
    const request = mockRequest();
    const commandId = faker.datatype.uuid();
    vi.spyOn(updateCommandStub, 'save').mockResolvedValueOnce({
      id: commandId,
      ...request.body,
      discordStatus: 'SENT'
    });
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(noContent());
    expect(socketSpy).toHaveBeenCalledWith('command', {
      id: commandId,
      discordStatus: 'SENT'
    });
  });
});
