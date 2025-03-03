import type { FastifyReply, FastifyRequest } from 'fastify';
import { UsersService } from '../../domain/services/index';
import httpCodes from '../../infrastructure/common/httpCodes.json';
import headers from '../../infrastructure/common/headers.json';
import { asyncLocalStorage as als } from '../../utils/als/index';

export class UsersController {
  private usersService: UsersService;
  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  async handler(request: FastifyRequest, reply: FastifyReply) {
    const response = await this.usersService.getUsers(request);
    const context = als.getStore()!;
    const sessionId = context['sessionId'];
    console.log(`User with session id -----  ${sessionId} =================`);
    reply.code(httpCodes.success.code).headers(headers.get).send(response);
  }
}
