import { ApplicationCommandType, CommandModel, CommandOptionType } from '@/domain/models/command';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type SaveCommandParams = Optional<CommandModel, 'id' | 'discordStatus'>;

export type QueueSaveCommandParams = {
  name: string;
  type: ApplicationCommandType;
  description: string;
  options?: Array<{
    name: string;
    description: string;
    type: CommandOptionType;
    required: boolean;
    choices?: Array<{
      name: string;
      value: string;
    }>;
  }>;
};

export interface SaveCommand {
  save: (data: SaveCommandParams) => Promise<CommandModel>;
}
