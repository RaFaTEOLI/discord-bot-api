export const spotifyParamsSchema = {
  type: 'object',
  properties: {
    code: {
      type: 'string'
    },
    state: {
      type: 'string'
    },
    redirectUri: {
      type: 'string'
    },
    encodedAuthorization: {
      type: 'string'
    }
  },
  required: ['code', 'state', 'redirectUri', 'encodedAuthorization']
};

export const spotifyRefreshTokenParamsSchema = {
  type: 'object',
  properties: {
    refreshToken: {
      type: 'string'
    },
    encodedAuthorization: {
      type: 'string'
    }
  },
  required: ['refreshToken', 'encodedAuthorization']
};

export const spotifyAccessTokenSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string'
    }
  }
};
