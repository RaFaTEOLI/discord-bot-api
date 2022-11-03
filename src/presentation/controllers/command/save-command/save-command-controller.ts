import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  SaveCommand
} from './save-command-controller-protocols';

export class SaveCommandController implements Controller {
  constructor(private readonly validation: Validation, private readonly saveCommand: SaveCommand) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      let validationBody = httpRequest.body;
      if (httpRequest.params?.commandId) {
        validationBody = Object.assign({}, validationBody, { id: httpRequest.params.commandId });
      }

      const error = this.validation.validate(validationBody);

      if (error) {
        return badRequest(error);
      }

      let saveParams = httpRequest.body;
      if (httpRequest.params?.commandId) {
        saveParams = Object.assign({}, saveParams, { id: httpRequest.params.commandId });
      }

      await this.saveCommand.save(saveParams);
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
