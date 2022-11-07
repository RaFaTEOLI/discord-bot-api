import { LoadMusic } from './load-music-controller-protocols';
import { LoadMusicController } from './load-music-controller';
import { serverError, success } from '@/presentation/helpers/http/http-helper';
import { mockLoadMusic } from '@/presentation/test';
import { mockMusicModel } from '@/domain/test';
import { MusicModel } from '@/domain/models/music';

interface SutTypes {
  sut: LoadMusicController;
  loadMusicStub: LoadMusic;
  fakeMusic: MusicModel;
}

const makeSut = (): SutTypes => {
  const fakeMusic = mockMusicModel();
  const loadMusicStub = mockLoadMusic(fakeMusic);
  const sut = new LoadMusicController(loadMusicStub);
  return {
    sut,
    loadMusicStub,
    fakeMusic
  };
};

describe('LoadMusic Controller', () => {
  test('should call LoadMusic', async () => {
    const { sut, loadMusicStub } = makeSut();
    const addSpy = jest.spyOn(loadMusicStub, 'load');
    await sut.handle();
    expect(addSpy).toHaveBeenCalled();
  });

  test('should return 500 if LoadMusic throws an exception', async () => {
    const { sut, loadMusicStub } = makeSut();
    jest.spyOn(loadMusicStub, 'load').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 200 with music on success', async () => {
    const { sut, fakeMusic } = makeSut();
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(success(fakeMusic));
  });
});
