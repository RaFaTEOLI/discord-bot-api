import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { LoadDiscordCommandsController } from '@/presentation/controllers/command/load-discord-commands/load-discord-commands-controller';
import { makeRemoteLoadDiscordCommands } from '@/main/factories/usecases/command/load-discord-commands/remote-load-discord-commands-factory';

export const makeLoadDiscordCommandsController = (): Controller => {
  return makeLogControllerDecorator(new LoadDiscordCommandsController(makeRemoteLoadDiscordCommands()));
};
