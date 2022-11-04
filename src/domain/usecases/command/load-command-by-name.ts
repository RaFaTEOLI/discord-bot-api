import { CommandModel } from '@/domain/models/command';

export interface LoadCommandByName {
  loadByName: (id: string) => Promise<CommandModel>;
}
