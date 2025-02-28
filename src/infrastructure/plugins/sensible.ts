import fp from 'fastify-plugin';
import fastifySensible from '@fastify/sensible';
import { FastifyInstance } from 'fastify';

export default fp(async (fastify: FastifyInstance) => {
  try {
    await fastify.register(fastifySensible);
  } catch (error) {
    fastify.log.error('Error loading sensible plugin', error);
    throw error;
  }
});
