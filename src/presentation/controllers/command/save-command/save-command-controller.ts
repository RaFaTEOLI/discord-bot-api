import { InvalidParamError } from '@/presentation/errors';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  SaveCommand,
  QueueSaveCommandParams
} from './save-command-controller-protocols';
import { Socket } from 'socket.io-client';
import { AmqpClient } from '@/infra/queue/amqp-client';
import { ApplicationCommandType } from '../load-commands/load-commands-protocols';

export class SaveCommandController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly saveCommand: SaveCommand,
    private readonly socketClient: Socket,
    private readonly amqpClient: AmqpClient<QueueSaveCommandParams>,
    private readonly useApiQueue: boolean
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

      if (this.useApiQueue) {
        try {
          await this.amqpClient.send('command', {
            id: command.id,
            name: command.command,
            type: command.discordType,
            ...(command.discordType === ApplicationCommandType.CHAT_INPUT && {
              description: command.description
            }),
            ...(command.options && { options: command.options })
          });
        } catch (err) {
          console.error(
            `Error sending command payload to API Queue: ${JSON.stringify(saveParams)} with error: ${
              err.message as string
            }`
          );
        }
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
