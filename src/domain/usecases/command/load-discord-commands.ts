import { DiscordCommandModel } from '@/domain/models/discord-command-model';

export interface LoadDiscordCommands {
  all: () => Promise<DiscordCommandModel[]>;
}
