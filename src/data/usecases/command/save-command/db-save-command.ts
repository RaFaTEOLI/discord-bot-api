import { QueueSaveCommandParams, SaveCommand, SaveCommandParams } from '@/domain/usecases/command/save-command';
import { SaveCommandRepository, LoadCommandByNameRepository, CommandModel } from './db-save-command-protocols';
import { AmqpClient } from '@/infra/queue/amqp-client';

export class DbSaveCommand implements SaveCommand {
  constructor(
    private readonly saveCommandRepository: SaveCommandRepository,
    private readonly loadCommandByName: LoadCommandByNameRepository,
    private readonly amqpClient: AmqpClient<QueueSaveCommandParams>,
    private readonly useApiQueue: boolean
  ) {}

  async save(data: SaveCommandParams): Promise<CommandModel> {
    const command = data.id ? null : await this.loadCommandByName.loadByName(data.command);
    if (!command) {
      const savedCommand = await this.saveCommandRepository.save(data);

      if (this.useApiQueue) {
        try {
          await this.amqpClient.send('command', {
            name: savedCommand.command,
            type: savedCommand.discordType,
            description: savedCommand.description,
            ...(savedCommand.options && { options: savedCommand.options })
          });
        } catch (err) {
          console.error(
            `Error sending command payload to API Queue: ${JSON.stringify(data)} with error: ${
              err.message as string
            }`
          );
        }
      }

      return savedCommand;
    }
    return null;
  }
}
