export const songParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    author: {
      type: 'string'
    },
    url: {
      type: 'string'
    },
    thumbnail: {
      type: 'string'
    },
    duration: {
      type: 'string'
    }
  },
  required: ['name', 'author', 'url', 'thumbnail', 'duration']
};
