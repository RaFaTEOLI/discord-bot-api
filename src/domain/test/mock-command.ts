import { CommandModel } from '@/domain/models/command';
import { SaveCommandParams } from '@/domain/usecases/command/save-command';

export const mockCommandModel = (): CommandModel => {
  return {
    id: 'any_id',
    command: 'any_command',
    dispatcher: 'message',
    type: 'message',
    description: 'any_description',
    response: 'any_response',
    message: 'any_message'
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
      message: 'any_message'
    },
    {
      id: 'other_id',
      command: 'other_command',
      dispatcher: 'client',
      type: 'action',
      description: 'other_description',
      response: 'other_response',
      message: 'other_message'
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
