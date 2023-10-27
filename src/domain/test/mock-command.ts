import { ApplicationCommandType, CommandModel, CommandOptionType } from '@/domain/models/command';
import { QueueSaveCommandParams, SaveCommandParams } from '@/domain/usecases/command/save-command';
import { faker } from '@faker-js/faker';

export const mockApplicationCommandDiscordType = (): ApplicationCommandType =>
  faker.helpers.arrayElement([
    ApplicationCommandType.CHAT_INPUT,
    ApplicationCommandType.MESSAGE,
    ApplicationCommandType.USER
  ]);

const mockCommandOptionDiscordType = (): CommandOptionType =>
  faker.helpers.arrayElement([
    CommandOptionType.SUB_COMMAND,
    CommandOptionType.SUB_COMMAND_GROUP,
    CommandOptionType.STRING,
    CommandOptionType.INTEGER,
    CommandOptionType.BOOLEAN,
    CommandOptionType.USER,
    CommandOptionType.CHANNEL,
    CommandOptionType.ROLE,
    CommandOptionType.MENTIONABLE,
    CommandOptionType.NUMBER,
    CommandOptionType.ATTACHMENT
  ]);

export const mockCommandModel = (override?: Partial<CommandModel>): CommandModel => {
  return {
    id: 'any_id',
    command: faker.word.verb(),
    dispatcher: faker.helpers.arrayElement(['client', 'message']),
    type: faker.helpers.arrayElement(['music', 'action', 'message']),
    description: faker.lorem.words(3),
    response: faker.lorem.words(2),
    message: faker.lorem.words(2),
    discordType: override?.discordType ?? mockApplicationCommandDiscordType(),
    discordStatus: override?.discordStatus ?? faker.helpers.arrayElement(['SENT', 'RECEIVED', 'FAILED']),
    options: [
      {
        name: faker.word.verb(),
        description: faker.lorem.words(3),
        required: faker.datatype.boolean(),
        type: mockCommandOptionDiscordType()
      }
    ]
  };
};

export const mockCommandsData = (): CommandModel[] => {
  return [
    {
      id: faker.datatype.uuid(),
      command: faker.word.verb(),
      dispatcher: faker.helpers.arrayElement(['client', 'message']),
      type: faker.helpers.arrayElement(['music', 'action', 'message']),
      description: faker.lorem.words(3),
      response: faker.lorem.words(2),
      message: faker.lorem.words(2),
      discordType: mockApplicationCommandDiscordType(),
      discordStatus: faker.helpers.arrayElement(['SENT', 'RECEIVED', 'FAILED'])
    },
    {
      id: faker.datatype.uuid(),
      command: faker.word.verb(),
      dispatcher: faker.helpers.arrayElement(['client', 'message']),
      type: faker.helpers.arrayElement(['music', 'action', 'message']),
      description: faker.lorem.words(3),
      response: faker.lorem.words(2),
      message: faker.lorem.words(2),
      discordType: mockApplicationCommandDiscordType(),
      discordStatus: faker.helpers.arrayElement(['SENT', 'RECEIVED', 'FAILED']),
      options: [
        {
          name: faker.word.verb(),
          description: faker.lorem.words(3),
          required: faker.datatype.boolean(),
          type: mockCommandOptionDiscordType()
        }
      ]
    }
  ];
};

export const mockSaveCommandParams = (params?: {
  withOptions?: boolean;
  discordType: ApplicationCommandType;
}): SaveCommandParams => ({
  command: faker.word.verb(),
  dispatcher: faker.helpers.arrayElement(['client', 'message']),
  type: faker.helpers.arrayElement(['music', 'action', 'message']),
  description: faker.lorem.words(3),
  response: faker.lorem.words(2),
  message: faker.lorem.words(2),
  discordType: params?.discordType ?? mockApplicationCommandDiscordType(),
  ...(params?.withOptions && {
    options: [
      {
        name: faker.word.verb(),
        description: faker.lorem.words(3),
        required: faker.datatype.boolean(),
        type: mockCommandOptionDiscordType()
      }
    ]
  })
});

export const mockQueueSaveCommandParams = (params?: { withOptions?: boolean }): QueueSaveCommandParams => ({
  name: faker.word.verb(),
  type: mockApplicationCommandDiscordType(),
  description: faker.lorem.words(3),
  ...(params?.withOptions && {
    options: [
      {
        name: faker.word.verb(),
        description: faker.lorem.words(3),
        required: faker.datatype.boolean(),
        type: mockCommandOptionDiscordType()
      }
    ]
  })
});
