import { InvalidParamError } from '@/presentation/errors';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, SaveMusic } from './save-music-controller-protocols';

export class SaveMusicController implements Controller {
  constructor(private readonly saveMusic: SaveMusic) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!('name' in httpRequest.body)) {
        return badRequest(new InvalidParamError('name'));
      }

      const { name } = httpRequest.body;
      await this.saveMusic.save({ name });
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
