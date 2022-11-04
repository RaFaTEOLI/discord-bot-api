export const healthCheckPath = {
  post: {
    tags: ['Health Check'],
    summary: 'API to check status',
    description: 'This route is for anyone',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              example: {
                message: 'string'
              }
            }
          }
        }
      }
    }
  }
};
