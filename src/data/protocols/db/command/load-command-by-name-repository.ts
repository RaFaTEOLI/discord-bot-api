import { CommandModel } from '@/domain/models/command';

export interface LoadCommandByNameRepository {
  loadByName: (name: string) => Promise<CommandModel>;
}
