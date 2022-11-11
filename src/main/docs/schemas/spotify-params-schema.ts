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
