import { DeleteCommandByIdController } from './delete-command-by-id-controller';
import { DeleteCommandById, LoadCommandById, HttpRequest } from './delete-command-by-id-protocols';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import { mockDeleteCommandById, mockLoadCommandById } from '@/presentation/test';
import { faker } from '@faker-js/faker';
import { InvalidParamError } from '@/presentation/errors';
import { describe, test, expect, vi } from 'vitest';

interface SutTypes {
  sut: DeleteCommandByIdController;
  loadCommandByIdStub: LoadCommandById;
  deleteCommandByIdStub: DeleteCommandById;
}

const mockRequest = (): HttpRequest => ({
  params: {
    commandId: faker.datatype.uuid()
  }
});

const makeSut = (): SutTypes => {
  const loadCommandByIdStub = mockLoadCommandById();
  const deleteCommandByIdStub = mockDeleteCommandById();
  const sut = new DeleteCommandByIdController(loadCommandByIdStub, deleteCommandByIdStub);
  return {
    sut,
    loadCommandByIdStub,
    deleteCommandByIdStub
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
});
