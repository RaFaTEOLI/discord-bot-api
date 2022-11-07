export const saveQueueParamsSchema = {
  type: 'object',
  properties: {
    songs: {
      type: 'array',
      items: {
        $ref: '#/schemas/songParams'
      }
    }
  },
  required: ['songs']
};
