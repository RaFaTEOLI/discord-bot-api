import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, LoadDiscordCommands } from './load-discord-commands-protocols';

export class LoadDiscordCommandsController implements Controller {
  constructor(private readonly loadCommands: LoadDiscordCommands) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const commands = await this.loadCommands.all();
      return commands.length ? success(commands) : noContent();
    } catch (err) {
      return serverError(err);
    }
  }
}
