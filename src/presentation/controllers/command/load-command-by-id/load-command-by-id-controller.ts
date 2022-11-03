import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, LoadCommandById } from './load-command-by-id-protocols';

export class LoadCommandByIdController implements Controller {
  constructor(private readonly loadCommandById: LoadCommandById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const command = await this.loadCommandById.loadById(httpRequest.params.commandId);
      return command ? success(command) : noContent();
    } catch (err) {
      return serverError(err);
    }
  }
}
