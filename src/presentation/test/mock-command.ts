import { SaveCommand, SaveCommandParams } from '@/domain/usecases/command/save-command';
import { LoadCommands } from '@/domain/usecases/command/load-commands';
import { CommandModel } from '@/domain/models/command';
import { mockCommandModel, mockCommandsData } from '@/domain/test';
import { LoadCommandById } from '@/domain/usecases/command/load-command-by-id';
import { LoadCommandByName } from '@/domain/usecases/command/load-command-by-name';
import { DeleteCommandById } from '../controllers/command/delete-command-by-id/delete-command-by-id-protocols';

export const mockSaveCommand = (): SaveCommand => {
  class SaveCommandStub implements SaveCommand {
    async save(data: SaveCommandParams): Promise<CommandModel> {
      return await Promise.resolve(mockCommandModel());
    }
  }
  return new SaveCommandStub();
};

export const mockLoadCommands = (): LoadCommands => {
  class LoadCommands implements LoadCommands {
    async load(): Promise<CommandModel[]> {
      return await Promise.resolve(mockCommandsData());
    }
  }
  return new LoadCommands();
};

export const mockLoadCommandById = (): LoadCommandById => {
  class LoadCommandByIdStub implements LoadCommandById {
    async loadById(id: string): Promise<CommandModel> {
      return await Promise.resolve(mockCommandModel());
    }
  }
  return new LoadCommandByIdStub();
};

export const mockLoadCommandByName = (): LoadCommandByName => {
  class LoadCommandByNameStub implements LoadCommandByName {
    async loadByName(name: string): Promise<CommandModel> {
      return await Promise.resolve(mockCommandModel());
    }
  }
  return new LoadCommandByNameStub();
};

export const mockDeleteCommandById = (): DeleteCommandById => {
  class DeleteCommandByIdStub implements DeleteCommandById {
    async deleteById(id: string): Promise<boolean> {
      return await Promise.resolve(true);
    }
  }
  return new DeleteCommandByIdStub();
};
