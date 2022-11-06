export const saveMusicParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  },
  required: ['name']
};
