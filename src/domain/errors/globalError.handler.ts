/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { FastifyInstance } from 'fastify/types/instance';

import { FastifyError } from 'fastify';

type ApiError = FastifyError & { code: string; message: string };
class GlobalErrorHandler {
  private static errorMap = new Map([
    [
      'bad_request',
      (reply: FastifyReply, error: ApiError) => reply.code(400).send({ code: error['code'], message: error.message })
    ],
    [
      'not_found',
      (reply: FastifyReply, error: Error) => reply.code(404).send({ code: error['name'], message: error.message })
    ],
    [
      'unauthorized',
      (reply: FastifyReply, error: ApiError) => reply.code(401).send({ code: error['name'], message: error.message })
    ]
  ]);

  static handle(error: ApiError, _request: FastifyRequest, reply: FastifyReply) {
    for (const [ErrorType, handler] of this.errorMap) {
      if (
        (error as Error).name === ErrorType ||
        (error as Error).message === ErrorType ||
        error['code'] === ErrorType
      ) {
        return handler(reply, error);
      }
    }
    // Default error handler
    reply.internalServerError(error.message);
  }
}

export const globalErrorHandler: FastifyInstance['errorHandler'] = GlobalErrorHandler.handle.bind(GlobalErrorHandler);
