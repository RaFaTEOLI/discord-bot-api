import { SaveCommand, SaveCommandParams } from '@/domain/usecases/command/save-command';
import { SaveCommandRepository } from './db-save-command-protocols';
import env from '@/main/config/env';

export class DbSaveCommand implements SaveCommand {
  constructor(private readonly saveCommandRepository: SaveCommandRepository) {}

  async save(data: SaveCommandParams): Promise<void> {
    let commandData = data;
    if (!commandData.command.startsWith(env.commandPrefix)) {
      commandData = Object.assign({}, commandData, { command: `${env.commandPrefix}${commandData.command}` });
    }
    await this.saveCommandRepository.save(commandData);
  }
}
