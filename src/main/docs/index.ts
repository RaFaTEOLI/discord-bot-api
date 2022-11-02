import paths from './paths';
import schemas from './schemas';
import components from './components';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Discord Bot API',
    description: 'API to manage bot commands',
    version: '1.0.0'
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    {
      name: 'Authentication'
    },
    { name: 'Command' }
  ],
  paths,
  schemas,
  components
};
