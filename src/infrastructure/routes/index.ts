/* eslint-disable @typescript-eslint/no-explicit-any */
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import type { FastifyRegisterOptions } from 'fastify';
import { UsersRoutes } from './users.routes';

export default fp(async (fastify: FastifyInstance) => {
  const usersRoutes = new UsersRoutes().routes;

  const routesPromises = [
    fastify.register(usersRoutes, { prefix: UsersRoutes.prefix_route } as FastifyRegisterOptions<any>)
  ];
  await Promise.all(routesPromises);
});
