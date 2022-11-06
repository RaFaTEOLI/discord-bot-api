export const musicSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    startedAt: {
      type: 'number'
    }
  },
  required: ['name']
};
