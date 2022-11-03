import { CommandModel } from '@/domain/models/command';
import { SaveCommandParams } from '@/domain/usecases/command/save-command';

export interface SaveCommandRepository {
  save: (data: SaveCommandParams) => Promise<CommandModel>;
}
