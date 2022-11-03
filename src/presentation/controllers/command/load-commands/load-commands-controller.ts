import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, LoadCommands } from './load-commands-protocols';

export class LoadCommandsController implements Controller {
  constructor(private readonly loadCommands: LoadCommands) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const commands = await this.loadCommands.load();
      return commands.length ? success(commands) : noContent();
    } catch (err) {
      return serverError(err);
    }
  }
}
