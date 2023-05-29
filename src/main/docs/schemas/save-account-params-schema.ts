export const saveAccountParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    spotify: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string'
        },
        refreshToken: {
          type: 'string'
        }
      }
    },
    discord: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        username: {
          type: 'string'
        },
        avatar: {
          type: 'string'
        },
        discriminator: {
          type: 'string'
        }
      }
    }
  }
};
