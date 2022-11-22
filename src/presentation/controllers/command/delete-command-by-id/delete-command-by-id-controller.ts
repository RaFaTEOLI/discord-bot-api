import { InvalidParamError } from '@/presentation/errors';
import { noContent, serverError, badRequest } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, DeleteCommandById } from './delete-command-by-id-protocols';

export class DeleteCommandByIdController implements Controller {
  constructor(private readonly deleteCommandById: DeleteCommandById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const command = await this.deleteCommandById.deleteById(httpRequest.params.commandId);
      return command ? noContent() : badRequest(new InvalidParamError('commandId'));
    } catch (err) {
      return serverError(err);
    }
  }
}
