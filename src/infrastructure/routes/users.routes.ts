import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { di } from '../../di';
import { UsersController } from '../../application/controllers';

export class UsersRoutes {
  static readonly prefix_route = '/';

  routes(fastify: FastifyInstance, _opts: FastifyPluginOptions, done: () => void) {
    const controller = new UsersController(di.usersService);
    const getHandler = controller.handler.bind(controller);

    fastify.get('/users', getHandler);

    done();
  }
}
