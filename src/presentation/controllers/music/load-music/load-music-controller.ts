import { serverError, success } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpResponse, LoadMusic } from './load-music-controller-protocols';

export class LoadMusicController implements Controller {
  constructor(private readonly loadMusic: LoadMusic) {}

  async handle(): Promise<HttpResponse> {
    try {
      const music = await this.loadMusic.load();
      return success(music);
    } catch (error) {
      return serverError(error);
    }
  }
}
