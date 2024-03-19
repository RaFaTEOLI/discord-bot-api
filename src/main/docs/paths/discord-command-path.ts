export const discordCommandPath = {
  get: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Discord Command'],
    summary: 'API to list all commands stored in Discord Application',
    description: 'This route is only for **admin users**',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/discordCommands'
            }
          }
        }
      },
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
