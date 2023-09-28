import { CommandModel } from '@/domain/models/command';
import { SaveCommandParams } from '@/domain/usecases/command/save-command';
import { faker } from '@faker-js/faker';

export const mockCommandModel = (override?: Partial<CommandModel>): CommandModel => {
  return {
    id: 'any_id',
    command: 'any_command',
    dispatcher: 'message',
    type: 'message',
    description: 'any_description',
    response: 'any_response',
    message: 'any_message',
    discordStatus: override?.discordStatus ?? faker.helpers.arrayElement(['SENT', 'RECEIVED', 'FAILED'])
  };
};

export const mockCommandsData = (): CommandModel[] => {
  return [
    {
      id: 'any_id',
      command: 'any_command',
      dispatcher: 'message',
      type: 'message',
      description: 'any_description',
      response: 'any_response',
      message: 'any_message',
      discordStatus: 'SENT'
    },
    {
      id: 'other_id',
      command: 'other_command',
      dispatcher: 'client',
      type: 'action',
      description: 'other_description',
      response: 'other_response',
      message: 'other_message',
      discordStatus: 'RECEIVED'
    }
  ];
};

export const mockSaveCommandParams = (): SaveCommandParams => ({
  command: 'any_command',
  dispatcher: 'message',
  type: 'message',
  description: 'any_description',
  response: 'any_response',
  message: 'any_message'
});
