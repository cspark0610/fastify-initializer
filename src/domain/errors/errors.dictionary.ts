type ErrorType = {
  status: number;
  name: string;
  code?: string;
  message?: string;
};

export class SystemError extends Error {
  constructor(code: string, msg?: string) {
    super(code);
    this.message = msg || 'Internal Server Error';
    Object.setPrototypeOf(this, SystemError.prototype);
  }
}

export class UnauthorizedError extends Error {
  constructor(name: string, msg?: string) {
    super();
    this.name = name;
    this.message = msg || 'Unauthorized';
  }
}

export class BadRequestError extends Error {
  code: string;

  constructor(name: string, code?: string, msg?: string) {
    super();
    this.name = name;
    this.code = code || '';
    this.message = msg || 'Bad Request';
  }
}

export class NotFoundError extends Error {
  constructor(name: string, msg?: string) {
    super();
    this.name = name;
    this.message = msg || 'Not found';
  }
}

export const errorDictionary = new Map<string, ErrorType>([
  [BadRequestError.name, { status: 400, name: 'bad_request' }],
  [UnauthorizedError.name, { status: 401, name: 'unauthorized' }],
  [NotFoundError.name, { status: 404, name: 'not_found' }],
  [SystemError.name, { status: 500, name: 'internal_server_error' }]
]);

export const FST_ERR_VALIDATION = 'FST_ERR_VALIDATION';
