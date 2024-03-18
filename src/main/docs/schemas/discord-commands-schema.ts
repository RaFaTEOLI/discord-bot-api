export const discordCommandsSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/discordCommand'
  }
};
