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
  },
  get: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Queue'],
    summary: 'API to fetch current queue',
    description: 'This route is only for **authenticated users**',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/queue'
            }
          }
        }
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
