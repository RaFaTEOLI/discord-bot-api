export const songSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
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
