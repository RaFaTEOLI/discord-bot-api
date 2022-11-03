import { CommandModel } from '@/domain/models/command';

export interface LoadCommands {
  load: () => Promise<CommandModel[]>;
}
