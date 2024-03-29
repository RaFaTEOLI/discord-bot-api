import { DeleteCommandByIdController } from './delete-command-by-id-controller';
import {
  DeleteCommandById,
  LoadCommandById,
  HttpRequest,
  QueueDeleteCommandParams
} from './delete-command-by-id-protocols';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import { mockAmqpClient, mockDeleteCommandById, mockLoadCommandById } from '@/presentation/test';
import { faker } from '@faker-js/faker';
import { InvalidParamError } from '@/presentation/errors';
import { describe, test, expect, vi } from 'vitest';
import { AmqpClientSpy } from '@/data/test';
import { mockCommandModel } from '@/domain/test';

interface SutTypes {
  sut: DeleteCommandByIdController;
  loadCommandByIdStub: LoadCommandById;
  deleteCommandByIdStub: DeleteCommandById;
  amqpClientStub: AmqpClientSpy<QueueDeleteCommandParams>;
}

const mockRequest = (): HttpRequest => ({
  params: {
    commandId: faker.datatype.uuid()
  }
});

const makeSut = (useApiQueue = false): SutTypes => {
  const loadCommandByIdStub = mockLoadCommandById();
  const deleteCommandByIdStub = mockDeleteCommandById();
  const amqpClientStub = mockAmqpClient<QueueDeleteCommandParams>();
  const sut = new DeleteCommandByIdController(
    loadCommandByIdStub,
    deleteCommandByIdStub,
    amqpClientStub,
    useApiQueue
  );
  return {
    sut,
    loadCommandByIdStub,
    deleteCommandByIdStub,
    amqpClientStub
  };
};

describe('DeleteCommandById Controller', () => {
  test('should call LoadCommandById and DeleteCommandById with correct id', async () => {
    const { sut, loadCommandByIdStub, deleteCommandByIdStub } = makeSut();
    const loadSpy = vi.spyOn(loadCommandByIdStub, 'loadById');
    const deleteSpy = vi.spyOn(deleteCommandByIdStub, 'deleteById');
    const request = mockRequest();
    await sut.handle(request);
    expect(loadSpy).toHaveBeenCalledWith(request.params.commandId);
    expect(deleteSpy).toHaveBeenCalledWith(request.params.commandId);
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test('should return 400 if DeleteCommandById returns false', async () => {
    const { sut, deleteCommandByIdStub } = makeSut();
    vi.spyOn(deleteCommandByIdStub, 'deleteById').mockResolvedValue(null);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('commandId')));
  });

  test('should return 500 if DeleteCommandById throws an exception', async () => {
    const { sut, deleteCommandByIdStub } = makeSut();
    vi.spyOn(deleteCommandByIdStub, 'deleteById').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 400 if LoadCommandById returns null', async () => {
    const { sut, loadCommandByIdStub } = makeSut();
    vi.spyOn(loadCommandByIdStub, 'loadById').mockResolvedValue(null);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('commandId')));
  });

  test('should call AmqpClient with discordId', async () => {
    const { sut, loadCommandByIdStub, amqpClientStub } = makeSut(true);
    const discordId = faker.datatype.uuid();
    const commandModel = mockCommandModel({ discordId });
    vi.spyOn(loadCommandByIdStub, 'loadById').mockResolvedValue(commandModel);
    const sendSpy = vi.spyOn(amqpClientStub, 'send');
    await sut.handle(mockRequest());
    expect(sendSpy).toHaveBeenCalledWith('delete-command', {
      discordId: commandModel.discordId
    });
  });

  test('should not call AmqpClient when useApiQueue is false', async () => {
    const { sut, amqpClientStub } = makeSut();
    const sendSpy = vi.spyOn(amqpClientStub, 'send');
    await sut.handle(mockRequest());
    expect(sendSpy).not.toHaveBeenCalled();
  });

  test('should not call AmqpClient when command does not have a discordId', async () => {
    const { sut, loadCommandByIdStub, amqpClientStub } = makeSut(true);
    const commandModel = mockCommandModel();
    delete commandModel.discordId;
    vi.spyOn(loadCommandByIdStub, 'loadById').mockResolvedValue(commandModel);
    const sendSpy = vi.spyOn(amqpClientStub, 'send');
    await sut.handle(mockRequest());
    expect(sendSpy).not.toHaveBeenCalled();
  });
});
