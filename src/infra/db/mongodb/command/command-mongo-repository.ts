/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/brace-style */

import { SaveCommandRepository, SaveCommandParams } from '@/data/protocols/db/command/save-command-repository';
import { LoadCommandByIdRepository } from '@/data/usecases/command/load-command-by-id/db-load-command-by-id-protocols';
import { CommandModel } from '@/domain/models/command';
import { LoadCommandsRepository } from '@/data/protocols/db/command/load-commands-repository';
import { ObjectId } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { LoadCommandByNameRepository } from '@/data/protocols/db/command/load-command-by-name-repository';
import { DeleteCommandByIdRepository } from '@/data/protocols/db/command/delete-command-by-id-repository';
export class CommandMongoRepository
  implements
    SaveCommandRepository,
    LoadCommandsRepository,
    LoadCommandByIdRepository,
    LoadCommandByNameRepository,
    DeleteCommandByIdRepository
{
  async save(commandData: SaveCommandParams): Promise<CommandModel> {
    const commandCollection = await MongoHelper.getCollection('commands');
    const result = await commandCollection.findOneAndUpdate(
      {
        _id: new ObjectId(commandData.id)
      },
      {
        $set: {
          ...(commandData.command && { command: commandData.command }),
          ...(commandData.dispatcher && { dispatcher: commandData.dispatcher }),
          ...(commandData.type && { type: commandData.type }),
          ...(commandData.description && { description: commandData.description }),
          ...(commandData.response && { response: commandData.response }),
          ...(commandData.message && { message: commandData.message }),
          ...(commandData.discordType && { discordType: commandData.discordType }),
          ...(commandData.options && { options: commandData.options }),
          ...(commandData.discordId && { discordId: commandData.discordId }),
          ...(commandData.discordStatus && { discordStatus: commandData.discordStatus })
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    return MongoHelper.format(result.value);
  }

  async loadAll(): Promise<CommandModel[]> {
    const commandCollection = await MongoHelper.getCollection('commands');
    const commands = await commandCollection.find().toArray();
    return MongoHelper.formatArray(commands);
  }

  async loadById(id: string): Promise<CommandModel> {
    const commandCollection = await MongoHelper.getCollection('commands');
    const command = await commandCollection.findOne({ _id: new ObjectId(id) });
    return MongoHelper.format(command);
  }

  async loadByName(name: string): Promise<CommandModel> {
    const commandCollection = await MongoHelper.getCollection('commands');
    const command = await commandCollection.findOne({ command: name });
    return MongoHelper.format(command);
  }

  async deleteById(id: string): Promise<boolean> {
    const commandCollection = await MongoHelper.getCollection('commands');
    const result = await commandCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return true;
    } else {
      return false;
    }
  }
}
