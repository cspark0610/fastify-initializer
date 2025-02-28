import fastifyEnv from '@fastify/env';
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';

const getPath = () => {
  switch (process.env['NODE_CONFIG_ENV']) {
    case 'dev':
      return '.env.dev';
    case 'tst':
      return '.env.tst';
    case 'stg':
      return '.env.stg';
    default:
      return '.env.stg';
  }
};

dotenv.config({ path: getPath() });
const schema = {
  type: 'object',
  required: ['STAGE'],
  properties: {
    STAGE: {
      type: 'string'
    }
  }
};
const configOptions = {
  confKey: 'config',
  schema: schema,
  data: process.env,
  dotenv: false,
  removeAdditional: false
};

export default fp(async (fastify: FastifyInstance) => {
  try {
    await fastify.register(fastifyEnv, configOptions);
    fastify.log.info('Config plugin loaded successfully with env variables');
  } catch (error) {
    fastify.log.error('Error loading config plugin', error);
    throw error;
  }
});
