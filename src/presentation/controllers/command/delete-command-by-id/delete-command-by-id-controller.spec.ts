import { DeleteCommandByIdController } from './delete-command-by-id-controller';
import { DeleteCommandById, HttpRequest } from './delete-command-by-id-protocols';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import { mockDeleteCommandById } from '@/presentation/test';
import { faker } from '@faker-js/faker';
import { InvalidParamError } from '@/presentation/errors';

interface SutTypes {
  sut: DeleteCommandByIdController;
  deleteCommandByIdStub: DeleteCommandById;
}

const mockRequest = (): HttpRequest => ({
  params: {
    commandId: faker.datatype.uuid()
  }
});

const makeSut = (): SutTypes => {
  const deleteCommandByIdStub = mockDeleteCommandById();
  const sut = new DeleteCommandByIdController(deleteCommandByIdStub);
  return {
    sut,
    deleteCommandByIdStub
  };
};

describe('DeleteCommandById Controller', () => {
  test('should call DeleteCommandById', async () => {
    const { sut, deleteCommandByIdStub } = makeSut();
    const loadSpy = jest.spyOn(deleteCommandByIdStub, 'deleteById');
    await sut.handle(mockRequest());
    expect(loadSpy).toHaveBeenCalled();
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test('should return 400 if DeleteCommandById returns false', async () => {
    const { sut, deleteCommandByIdStub } = makeSut();
    jest.spyOn(deleteCommandByIdStub, 'deleteById').mockResolvedValue(null);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('commandId')));
  });

  test('should return 500 if DeleteCommandById throws an exception', async () => {
    const { sut, deleteCommandByIdStub } = makeSut();
    jest.spyOn(deleteCommandByIdStub, 'deleteById').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
