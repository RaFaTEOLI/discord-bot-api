import { CommandModel } from '@/domain/models/command';
import { SaveCommandParams as FullSaveCommandParams } from '@/domain/usecases/command/save-command';

type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type SaveCommandParams = Partial<FullSaveCommandParams>;

export interface SaveCommandRepository {
  save: (data: SaveCommandParams) => Promise<CommandModel>;
}
