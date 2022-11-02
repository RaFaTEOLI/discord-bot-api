export const commandsSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/command'
  }
};
