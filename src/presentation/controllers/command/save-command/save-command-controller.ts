import { InvalidParamError } from '@/presentation/errors';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  SaveCommand
} from './save-command-controller-protocols';
import { Socket } from 'socket.io-client';

export class SaveCommandController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly saveCommand: SaveCommand,
    private readonly socketClient: Socket
  ) {}

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

      const command = await this.saveCommand.save(saveParams);
      if (!command) {
        return badRequest(new InvalidParamError('command'));
      }

      this.socketClient.emit('command', {
        id: command.id,
        discordStatus: command.discordStatus
      });

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
