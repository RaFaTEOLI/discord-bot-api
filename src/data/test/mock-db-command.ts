import { SaveCommandRepository } from '@/data/protocols/db/command/save-command-repository';
import { SaveCommandParams } from '@/domain/usecases/command/save-command';
import { CommandModel } from '@/domain/models/command';
import { mockCommandModel, mockCommandsData } from '@/domain/test';
import { LoadCommandsRepository } from '@/data/protocols/db/command/load-commands-repository';
import { LoadCommandByIdRepository } from '@/data/protocols/db/command/load-command-by-id-repository';
import { LoadCommandByNameRepository } from '@/data/protocols/db/command/load-command-by-name-repository';

export const mockSaveCommandRepository = (): SaveCommandRepository => {
  class SaveCommandRepositoryStub implements SaveCommandRepository {
    async save(command: SaveCommandParams): Promise<CommandModel> {
      return await Promise.resolve(mockCommandModel());
    }
  }
  return new SaveCommandRepositoryStub();
};

export const mockLoadCommandByIdRepository = (): LoadCommandByIdRepository => {
  class LoadCommandByIdRepositoryStub implements LoadCommandByIdRepository {
    async loadById(id: string): Promise<CommandModel> {
      return await Promise.resolve(mockCommandModel());
    }
  }
  return new LoadCommandByIdRepositoryStub();
};

export const mockLoadCommandsRepository = (): LoadCommandsRepository => {
  class LoadCommandsRepositoryStub implements LoadCommandsRepository {
    async loadAll(): Promise<CommandModel[]> {
      return await Promise.resolve(mockCommandsData());
    }
  }
  return new LoadCommandsRepositoryStub();
};

export const mockLoadCommandByNameRepository = (): LoadCommandByNameRepository => {
  class LoadCommandByNameRepositoryStub implements LoadCommandByNameRepository {
    async loadByName(name: string): Promise<CommandModel> {
      return await Promise.resolve(null);
    }
  }
  return new LoadCommandByNameRepositoryStub();
};
