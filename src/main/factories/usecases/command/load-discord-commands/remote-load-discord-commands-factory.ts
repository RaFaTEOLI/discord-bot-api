import { RemoteLoadDiscordCommands } from '@/data/usecases/command/load-discord-commands/remote-load-discord-commands';
import { LoadDiscordCommands } from '@/domain/usecases/command/load-discord-commands';
import env from '@/main/config/env';
import { makeAxiosHttpClient, makeDiscordApplicationApiUrl } from '@/main/factories/http';

export const makeRemoteLoadDiscordCommands = (): LoadDiscordCommands => {
  return new RemoteLoadDiscordCommands(
    makeDiscordApplicationApiUrl('/commands'),
    makeAxiosHttpClient(),
    env.discordBotToken
  );
};
