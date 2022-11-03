import { CommandModel } from '@/domain/models/command';

export interface LoadCommandById {
  loadById: (id: string) => Promise<CommandModel>;
}
