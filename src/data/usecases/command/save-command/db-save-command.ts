import { SaveCommand, SaveCommandParams } from '@/domain/usecases/command/save-command';
import { SaveCommandRepository, LoadCommandByNameRepository, CommandModel } from './db-save-command-protocols';
import env from '@/main/config/env';

export class DbSaveCommand implements SaveCommand {
  constructor(
    private readonly saveCommandRepository: SaveCommandRepository,
    private readonly loadCommandByName: LoadCommandByNameRepository
  ) {}

  async save(data: SaveCommandParams): Promise<CommandModel> {
    const command = data.id ? null : await this.loadCommandByName.loadByName(data.command);
    if (!command) {
      let commandData = data;
      if (!commandData.command.startsWith(env.commandPrefix)) {
        commandData = Object.assign({}, commandData, { command: `${env.commandPrefix}${commandData.command}` });
      }
      return await this.saveCommandRepository.save(commandData);
    }
    return null;
  }
}
