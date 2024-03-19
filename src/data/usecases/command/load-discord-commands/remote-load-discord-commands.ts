import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { DiscordCommandModel } from '@/domain/models/discord-command-model';
import { LoadDiscordCommands } from '@/domain/usecases/command/load-discord-commands';

export class RemoteLoadDiscordCommands implements LoadDiscordCommands {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<DiscordCommandModel[]>,
    private readonly botToken: string
  ) {}

  async all(): Promise<DiscordCommandModel[]> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get',
      headers: {
        Authorization: `Bot ${this.botToken}`
      }
    });
    const remoteCommands = httpResponse.body ?? [];
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return remoteCommands;
      case HttpStatusCode.noContent:
        return [];
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}
