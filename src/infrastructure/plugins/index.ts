import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

import helmet from './helmet';
import sensible from './sensible';
import config from './config';
import swagger from './swagger';

export default fp(async (fastify: FastifyInstance) => {
  try {
    let pluginsProm = [fastify.register(helmet), fastify.register(sensible)];

    if (process.env['ENVIRONMENT'] === 'LOCAL') {
      pluginsProm = [...pluginsProm, fastify.register(config), fastify.register(swagger)];
    }

    await Promise.all(pluginsProm);
  } catch (error) {
    fastify.log.error('Error loading plugins', error);
    throw error;
  }
});
