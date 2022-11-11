export const accountSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string'
    },
    user: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        name: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        password: {
          type: 'string'
        }
      }
    }
  }
};
