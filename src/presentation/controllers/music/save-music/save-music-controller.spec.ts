import { HttpRequest, SaveMusic } from './save-music-controller-protocols';
import { SaveMusicController } from './save-music-controller';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { mockSaveMusic } from '@/presentation/test';
import { mockSaveMusicParams } from '@/domain/test';
import { InvalidParamError } from '@/presentation/errors';

const mockRequest = (): HttpRequest => ({
  body: mockSaveMusicParams()
});

interface SutTypes {
  sut: SaveMusicController;
  saveMusicStub: SaveMusic;
}

const makeSut = (): SutTypes => {
  const saveMusicStub = mockSaveMusic();
  const sut = new SaveMusicController(saveMusicStub);
  return {
    sut,
    saveMusicStub
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
    const addSpy = jest.spyOn(saveMusicStub, 'save');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 500 if SaveMusic throws an exception', async () => {
    const { sut, saveMusicStub } = makeSut();
    jest.spyOn(saveMusicStub, 'save').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });
});
