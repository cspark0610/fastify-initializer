/* eslint-disable @typescript-eslint/no-explicit-any */
import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import path from 'path';
import fs from 'fs';
import { FastifyStaticSwaggerOptions } from '@fastify/swagger';
import yaml from 'js-yaml';

const readYAMLFile = (file: string) => {
  const fileContents = fs.readFileSync(file, 'utf8');
  return yaml.load(fileContents);
};

/**
 * @see https://github.com/fastify/fastify-swagger
 */
export default fastifyPlugin(async (fastify: FastifyInstance) => {
  const opts: FastifyStaticSwaggerOptions = {
    mode: 'static',
    specification: {
      document: readYAMLFile(path.join(__dirname, '../../../docs/swagger.yaml'))
    }
  };
  await fastify.register(import('@fastify/swagger'), opts);

  const registerSwaggerUi = async () => {
    return fastify.register(import('@fastify/swagger-ui'), {
      routePrefix: '/api/docs',
      initOAuth: {},
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false
      },
      staticCSP: true
    });
  };
  await registerSwaggerUi().then(() => {
    if (process.env['ENVIRONMENT'] === 'LOCAL') {
      console.log('/********** **************************************************************************** ********/');
      console.log(`/********** Swagger UI docs on:  http://localhost:${process.env['PORT'] || 3000}/api/docs *******/`);
      console.log('/********** **************************************************************************** ********/');
    }
  });
});
