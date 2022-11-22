export const commandParamPath = {
  put: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Command'],
    summary: 'API to update a command',
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
    parameters: [
      {
        in: 'path',
        name: 'commandId',
        description: 'ID from Command to be update',
        required: true,
        schema: {
          type: 'string'
        }
      }
    ],
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
    tags: ['Command'],
    summary: 'API to list all commands',
    description: 'This route is only for **authenticated users**',
    parameters: [
      {
        in: 'path',
        name: 'commandId',
        description: 'ID from Command to be fetched',
        required: true,
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
              $ref: '#/schemas/command'
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
  delete: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Command'],
    summary: 'API to delete a command',
    description: 'This route is only for **admins**',
    parameters: [
      {
        in: 'path',
        name: 'commandId',
        description: 'ID from Command to be deleted',
        required: true,
        schema: {
          type: 'string'
        }
      }
    ],
    responses: {
      204: {
        description: 'Success, No Content'
      },
      400: {
        $ref: '#/components/badRequest'
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
