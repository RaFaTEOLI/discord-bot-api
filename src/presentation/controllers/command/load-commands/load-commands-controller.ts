import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, LoadCommands, LoadCommandByName } from './load-commands-protocols';

export class LoadCommandsController implements Controller {
  constructor(
    private readonly loadCommands: LoadCommands,
    private readonly loadCommandByName: LoadCommandByName
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (httpRequest.query?.name) {
        const command = await this.loadCommandByName.loadByName(httpRequest.query.name);
        return command ? success(command) : noContent();
      }
      const commands = await this.loadCommands.load();
      return commands.length ? success(commands) : noContent();
    } catch (err) {
      return serverError(err);
    }
  }
}
