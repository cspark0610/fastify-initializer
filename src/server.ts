/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // this.server.register(decorateReqWithGetObservabilityHeaders);
    // this.server.addHook('onRequest', verifyToken);
    // this.server.addHook('onResponse', onResponseHook);

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
