export const accountPath = {
  patch: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Account'],
    summary: 'API to save current user info',
    description: 'This route is only for **authenticated users**',
    requestBody: {
      required: false,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveAccountParams'
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
