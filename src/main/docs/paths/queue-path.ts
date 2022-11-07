export const queuePath = {
  post: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Queue'],
    summary: 'API to save queue',
    description: 'This route is only for **admin users**',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveQueueParams'
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
