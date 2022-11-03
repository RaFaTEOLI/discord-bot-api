import { CommandModel } from '@/domain/models/command';

export interface LoadCommandsRepository {
  loadAll: () => Promise<CommandModel[]>;
}
