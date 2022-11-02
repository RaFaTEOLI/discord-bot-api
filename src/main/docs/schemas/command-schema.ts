export const commandSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    command: {
      type: 'string'
    },
    dispatcher: {
      type: 'string'
    },
    type: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    response: {
      type: 'string'
    },
    message: {
      type: 'string'
    }
  },
  required: ['id', 'command', 'dispatcher', 'type', 'description']
};
