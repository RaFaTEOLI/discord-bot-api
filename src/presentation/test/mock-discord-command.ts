import { mockRemoteDiscordCommandListModel } from '@/data/test/mock-remote-discord-command-list';
import { DiscordCommandModel } from '@/domain/models/discord-command-model';
import { LoadDiscordCommands } from '@/domain/usecases/command/load-discord-commands';

export const mockLoadDiscordCommands = (): LoadDiscordCommands => {
  class LoadDiscordCommandsStub implements LoadDiscordCommands {
    async all(): Promise<DiscordCommandModel[]> {
      return await Promise.resolve(mockRemoteDiscordCommandListModel());
    }
  }
  return new LoadDiscordCommandsStub();
};
