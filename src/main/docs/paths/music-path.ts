export const musicPath = {
  post: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Music'],
    summary: 'API to save current music',
    description: 'This route is only for **admin users**',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveMusicParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Success, No Content'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
};
