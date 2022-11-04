export const commandPath = {
  get: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Command'],
    summary: 'API to list all commands',
    description: 'This route is only for **authenticated users**',
    parameters: [
      {
        in: 'query',
        name: 'name',
        description: 'The name of command to be returned',
        required: false,
        schema: {
          type: 'string'
        }
      }
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/commands'
            }
          }
        }
      },
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
  post: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Command'],
    summary: 'API to create a command',
    description: 'This route is only for **admins**',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/SaveCommandParams'
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
