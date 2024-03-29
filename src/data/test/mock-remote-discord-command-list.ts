import { ApplicationCommandType, CommandOptionType } from '@/domain/models/command';
import { DiscordCommandModel } from '@/domain/models/discord-command-model';
import { faker } from '@faker-js/faker';

export const mockRemoteDiscordCommandModel = (withOptions = true): DiscordCommandModel => ({
  id: faker.datatype.uuid(),
  description: faker.lorem.words(3),
  type: faker.helpers.arrayElement([
    ApplicationCommandType.CHAT_INPUT,
    ApplicationCommandType.MESSAGE,
    ApplicationCommandType.USER
  ]),
  nsfw: false,
  name: faker.lorem.word(),
  application_id: faker.datatype.uuid(),
  default_member_permissions: null,
  version: faker.datatype.uuid(),
  dm_permissions: true,
  contexts: null,
  integration_types: [0],
  ...(withOptions && {
    options: [
      {
        type: faker.helpers.arrayElement([
          CommandOptionType.STRING,
          CommandOptionType.BOOLEAN,
          CommandOptionType.INTEGER
        ]),
        description: faker.lorem.words(3),
        name: faker.lorem.word(),
        required: faker.datatype.boolean()
      }
    ]
  })
});

export const mockRemoteDiscordCommandListModel = (): DiscordCommandModel[] => [
  mockRemoteDiscordCommandModel(),
  mockRemoteDiscordCommandModel(),
  mockRemoteDiscordCommandModel()
];
