import { LoadQueue } from './load-queue-controller-protocols';
import { LoadQueueController } from './load-queue-controller';
import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import { mockLoadQueue } from '@/presentation/test';
import { mockQueueModel } from '@/domain/test';
import { QueueModel } from '@/domain/models/queue';

interface SutTypes {
  sut: LoadQueueController;
  loadQueueStub: LoadQueue;
  fakeQueue: QueueModel;
}

const makeSut = (): SutTypes => {
  const fakeQueue = mockQueueModel();
  const loadQueueStub = mockLoadQueue(fakeQueue);
  const sut = new LoadQueueController(loadQueueStub);
  return {
    sut,
    loadQueueStub,
    fakeQueue
  };
};

describe('LoadQueue Controller', () => {
  test('should call LoadQueue', async () => {
    const { sut, loadQueueStub } = makeSut();
    const addSpy = jest.spyOn(loadQueueStub, 'load');
    await sut.handle();
    expect(addSpy).toHaveBeenCalled();
  });

  test('should return 500 if LoadQueue throws an exception', async () => {
    const { sut, loadQueueStub } = makeSut();
    jest.spyOn(loadQueueStub, 'load').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 200 with queue on success', async () => {
    const { sut, fakeQueue } = makeSut();
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(success(fakeQueue));
  });

  test('should return 204 if LoadQueue returns empty array', async () => {
    const { sut, loadQueueStub } = makeSut();
    jest.spyOn(loadQueueStub, 'load').mockResolvedValueOnce([] as never as QueueModel);
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(noContent());
  });
});
