import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, Validation, SaveQueue } from './save-queue-controller-protocols';

export class SaveQueueController implements Controller {
  constructor(private readonly validation: Validation, private readonly saveQueue: SaveQueue) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { songs } = httpRequest.body;
      await this.saveQueue.save(songs);
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
