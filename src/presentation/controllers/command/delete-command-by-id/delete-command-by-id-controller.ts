import { InvalidParamError } from '@/presentation/errors';
import { noContent, serverError, badRequest } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  DeleteCommandById,
  LoadCommandById
} from './delete-command-by-id-protocols';

export class DeleteCommandByIdController implements Controller {
  constructor(
    private readonly loadCommandById: LoadCommandById,
    private readonly deleteCommandById: DeleteCommandById
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.loadCommandById.loadById(httpRequest.params.commandId);
      const deleted = await this.deleteCommandById.deleteById(httpRequest.params.commandId);
      return deleted ? noContent() : badRequest(new InvalidParamError('commandId'));
    } catch (err) {
      return serverError(err);
    }
  }
}
