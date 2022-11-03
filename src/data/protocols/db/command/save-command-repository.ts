import { SaveCommandParams } from '@/domain/usecases/command/save-command';

export interface SaveCommandRepository {
  save: (data: SaveCommandParams) => Promise<void>;
}
