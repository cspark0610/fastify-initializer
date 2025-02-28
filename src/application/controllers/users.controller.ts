import type { FastifyReply, FastifyRequest } from 'fastify';
import { UsersService } from '../../domain/services/index';
import httpCodes from '../../infrastructure/common/httpCodes.json';
import headers from '../../infrastructure/common/headers.json';

export class UsersController {
  private usersService: UsersService;
  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  async handler(request: FastifyRequest, reply: FastifyReply) {
    const response = await this.usersService.getUsers(request);
    reply.code(httpCodes.success.code).headers(headers.get).send(response);
  }
}
