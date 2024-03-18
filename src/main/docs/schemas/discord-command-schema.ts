export const discordCommandSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    application_id: {
      type: 'string'
    },
    version: {
      type: 'string'
    },
    default_member_permissions: {
      type: 'integer',
      nullable: true
    },
    type: {
      type: 'number'
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    dm_permission: {
      type: 'boolean'
    },
    contexts: {
      type: 'integer',
      nullable: true
    },
    integration_types: {
      type: 'array'
    },
    options: {
      type: 'array',
      items: {
        type: {
          type: 'number'
        },
        name: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        required: {
          type: 'boolean'
        }
      }
    },
    nsfw: {
      type: 'boolean'
    }
  }
};
