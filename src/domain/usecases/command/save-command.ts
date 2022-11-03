import { CommandModel } from '@/domain/models/command';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type SaveCommandParams = Optional<CommandModel, 'id'>;

export interface SaveCommand {
  save: (data: SaveCommandParams) => Promise<CommandModel>;
}
