import { InvalidParamError } from '@/presentation/errors';
import { noContent, serverError, badRequest } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  DeleteCommandById,
  LoadCommandById,
  QueueDeleteCommandParams
} from './delete-command-by-id-protocols';
import { AmqpClient } from '@/infra/queue/amqp-client';
import { Queue } from '@/data/protocols/queue';

export class DeleteCommandByIdController implements Controller {
  constructor(
    private readonly loadCommandById: LoadCommandById,
    private readonly deleteCommandById: DeleteCommandById,
    private readonly amqpClient: AmqpClient<QueueDeleteCommandParams>,
    private readonly useApiQueue: boolean
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const command = await this.loadCommandById.loadById(httpRequest.params.commandId);
      if (!command) {
        return badRequest(new InvalidParamError('commandId'));
      }
      const deleted = await this.deleteCommandById.deleteById(httpRequest.params.commandId);

      if (deleted) {
        if (this.useApiQueue) {
          await this.amqpClient.send(Queue.DELETE_COMMAND, {
            discordId: command.discordId
          });
        }

        return noContent();
      }

      return badRequest(new InvalidParamError('commandId'));
    } catch (err) {
      return serverError(err);
    }
  }
}
