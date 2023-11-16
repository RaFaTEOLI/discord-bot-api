import { CommandModel } from '@/domain/models/command';

type Partial<T> = {
  [P in keyof T]?: T[P];
};
export type UpdateCommandParams = Partial<CommandModel>;

export interface UpdateCommand {
  save: (data: UpdateCommandParams) => Promise<CommandModel>;
}
