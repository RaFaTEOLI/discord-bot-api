import { HttpRequest, Validation, SaveCommand, QueueSaveCommandParams } from './save-command-controller-protocols';
import { SaveCommandController } from './save-command-controller';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { mockValidation, mockSaveCommand, mockSocketClient, mockAmqpClient } from '@/presentation/test';
import { mockCommandModel, mockSaveCommandParams } from '@/domain/test';
import { InvalidParamError } from '@/presentation/errors';
import { Socket } from 'socket.io-client';
import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';
import { faker } from '@faker-js/faker';
import { ApplicationCommandType } from '../load-commands/load-commands-protocols';
import { AmqpClientSpy } from '@/data/test';

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
  amqpClientStub: AmqpClientSpy<QueueSaveCommandParams>;
}

const makeSut = (useApiQueue = true): SutTypes => {
  const validationStub = mockValidation();
  const saveCommandStub = mockSaveCommand();
  const socketClientStub = mockSocketClient();
  const amqpClientStub = mockAmqpClient();
  const sut = new SaveCommandController(
    validationStub,
    saveCommandStub,
    socketClientStub,
    amqpClientStub,
    useApiQueue
  );
  return {
    sut,
    validationStub,
    saveCommandStub,
    socketClientStub,
    amqpClientStub
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
    const commandId = faker.datatype.uuid();
    vi.spyOn(saveCommandStub, 'save').mockResolvedValueOnce({
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

  test('should call AmqpClient when useApiQueue is true', async () => {
    const { sut, amqpClientStub } = makeSut();
    const sendSpy = vi.spyOn(amqpClientStub, 'send');
    await sut.handle(mockRequest());
    expect(sendSpy).toHaveBeenCalled();
  });

  test('should call console.error when AmqpClient fails', async () => {
    const { sut, amqpClientStub } = makeSut();
    vi.spyOn(amqpClientStub, 'send').mockRejectedValue(new Error());
    const errorLogSpy = vi.spyOn(console, 'error');
    const request = mockRequest();
    await sut.handle(request);
    expect(errorLogSpy).toHaveBeenCalledWith(
      `Error sending command payload to API Queue: ${JSON.stringify(request.body)} with error: ${
        new Error().message
      }`
    );
  });

  test('should not call AmqpClient when useApiQueue is false', async () => {
    const { sut, amqpClientStub, saveCommandStub } = makeSut(false);
    const sendSpy = vi.spyOn(amqpClientStub, 'send');
    const commandModel = mockCommandModel();
    vi.spyOn(saveCommandStub, 'save').mockResolvedValueOnce(commandModel);
    await sut.handle(mockRequest());
    expect(sendSpy).not.toHaveBeenCalled();
  });

  test('should call AmqpClient with description when command type is CHAT_INPUT', async () => {
    const { sut, amqpClientStub, saveCommandStub } = makeSut();
    const sendSpy = vi.spyOn(amqpClientStub, 'send');
    const commandModel = mockCommandModel({ discordType: ApplicationCommandType.CHAT_INPUT });
    vi.spyOn(saveCommandStub, 'save').mockResolvedValueOnce(commandModel);
    await sut.handle(mockRequest());
    expect(sendSpy).toHaveBeenCalledWith('command', {
      id: commandModel.id,
      name: commandModel.command,
      type: ApplicationCommandType.CHAT_INPUT,
      description: commandModel.description,
      ...(commandModel.options && { options: commandModel.options })
    });
  });

  test('should call AmqpClient without description when command type is different than CHAT_INPUT', async () => {
    const { sut, amqpClientStub, saveCommandStub } = makeSut();
    const sendSpy = vi.spyOn(amqpClientStub, 'send');
    const commandModel = mockCommandModel({
      discordType: faker.helpers.arrayElement([ApplicationCommandType.MESSAGE, ApplicationCommandType.USER])
    });
    vi.spyOn(saveCommandStub, 'save').mockResolvedValueOnce(commandModel);
    await sut.handle(mockRequest());
    expect(sendSpy).toHaveBeenCalledWith('command', {
      id: commandModel.id,
      name: commandModel.command,
      type: commandModel.discordType,
      ...(commandModel.options && { options: commandModel.options })
    });
  });

  test('should call AmqpClient with first word of command', async () => {
    const { sut, amqpClientStub, saveCommandStub } = makeSut();
    const sendSpy = vi.spyOn(amqpClientStub, 'send');
    const commandModel = mockCommandModel();
    const command = commandModel.command;
    commandModel.command = `${commandModel.command} ${faker.random.word()}`;
    vi.spyOn(saveCommandStub, 'save').mockResolvedValueOnce(commandModel);
    await sut.handle(mockRequest());
    expect(sendSpy).toHaveBeenCalledWith('command', {
      id: commandModel.id,
      name: command,
      type: commandModel.discordType,
      ...(commandModel.options && { options: commandModel.options })
    });
  });
});
