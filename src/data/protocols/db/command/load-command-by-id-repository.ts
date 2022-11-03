import { CommandModel } from '@/domain/models/command';

export interface LoadCommandByIdRepository {
  loadById: (id: string) => Promise<CommandModel>;
}
