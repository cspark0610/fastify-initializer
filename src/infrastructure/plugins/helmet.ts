import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import { FastifyInstance } from 'fastify';

export default fp(async (fastify: FastifyInstance) => {
  try {
    await fastify.register(helmet);
  } catch (error) {
    fastify.log.error('Error loading helmet plugin', error);
    throw error;
  }
});
