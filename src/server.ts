/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable n/no-process-exit */
import fastify, { FastifyInstance } from 'fastify';
import makePromisesSafe from 'make-promises-safe';
import closeWithGrace from 'close-with-grace';
import plugins from './infrastructure/plugins';
import routes from './infrastructure/routes';
import { globalErrorHandler } from './domain/errors/globalError.handler';
import JoiCompiler from 'joi-compiler';
import { LoggerClass } from './utils/logger/loggerClass';
import { errorDictionary, UnauthorizedError } from './domain/errors/errors.dictionary';
import { asyncLocalStorage } from './utils/als';
import jwt from 'jsonwebtoken';

export class Server {
  private server: FastifyInstance;
  private logger;

  constructor() {
    const joiCompilerInstance = JoiCompiler({
      onError: (err) => {
        throw err;
      }
    });
    this.logger = new LoggerClass().pub;

    this.server = fastify({
      loggerInstance: this.logger,
      disableRequestLogging: false,
      schemaController: {
        bucket: joiCompilerInstance.bucket,
        compilersFactory: {
          buildValidator: joiCompilerInstance.buildValidator
        }
      }
    });
  }

  private authHook(req, _reply, done: () => void) {
    const unauthorizedName = errorDictionary.get(UnauthorizedError.name)!.name;
    const authorization = req.headers['authorization'] || (req.headers['Authorization'] as string);
    if (!authorization) {
      throw new UnauthorizedError(unauthorizedName, 'Token missing in headers...');
    }
    const token = authorization.split(' ')[1];

    const decoded = jwt.decode(token!);
    if (!decoded || !decoded['session_id']) {
      throw new UnauthorizedError(unauthorizedName, 'Token is invalid...');
    }

    const sessionId = decoded['session_id'];

    const store = { sessionId };
    asyncLocalStorage.run(store, async () => {
      done();
    });
  }

  public async start(configStart: { host: string; port: number }) {
    this.configServer();

    try {
      await this.server.listen(configStart);
    } catch (err) {
      console.error(err, '/*** Error starting server ***/');
      process.exit(1);
    }
  }

  public createApp() {
    this.configServer();
    return this.server;
  }

  private registerPluginsAndRoutes() {
    this.server.register(plugins);
    this.server.register(routes);
  }

  private configServer() {
    this.server.addHook('onRequest', this.authHook);

    makePromisesSafe.logError = (err) => {
      this.server.log.error(err, 'UNHANDLER_ERROR_MESSAGE');
    };

    this.registerPluginsAndRoutes();

    this.server.setErrorHandler(globalErrorHandler);

    const closeListeners = closeWithGrace(
      { delay: Number(process.env['FASTIFY_CLOSE_GRACE_DELAY']) || 500 },
      async ({ signal: _signal, err, manual: _manual }) => {
        if (err) {
          this.server.log.error(err);
        }
        await this.server.close();
      }
    );

    this.server.addHook('onClose', (_instance, done) => {
      closeListeners.uninstall();
      done();
    });
  }
}
