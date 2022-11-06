import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, Validation, SaveMusic } from './save-music-controller-protocols';

export class SaveMusicController implements Controller {
  constructor(private readonly validation: Validation, private readonly saveMusic: SaveMusic) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { name } = httpRequest.body;
      await this.saveMusic.save({ name });
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
