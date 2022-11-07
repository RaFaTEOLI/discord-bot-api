export const queueSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/song'
  }
};
