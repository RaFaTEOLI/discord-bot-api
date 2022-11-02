export const saveCommandParamsSchema = {
  type: 'object',
  properties: {
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
  required: ['command', 'dispatcher', 'type', 'description']
};
