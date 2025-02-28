/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
import pino from 'pino';
import { randomBytes } from 'crypto';
import config from 'config';
import fs from 'fs';
import path from 'path';

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../package.json'), 'utf8'));
const loggerConfig = config.util.toObject(config.get('logger'));

export class LoggerClass {
  pub: any;
  loggerBase: pino.Logger;
  constructor() {
    const context: object = {
      observability: {
        consumer_id: 'CONSUMER_ID_DEFAULT',
        trace_id: randomBytes(12).toString('hex')
      },
      environment: process.env['STAGE'],
      apiReference: packageJson.name ?? 'API_REFERENCE_DEFAULT'
    };

    this.loggerBase = pino({
      ...loggerConfig,
      base: context
    });

    this.pub = this.loggerBase.child(context);
  }

  reset() {
    const context: object = {
      observability: {
        consumer_id: 'CONSUMER_ID_DEFAULT',
        trace_id: randomBytes(12).toString('hex')
      },
      environment: process.env['STAGE'],
      apiReference: packageJson.name
    };
    this.pub = this.loggerBase.child(context);
  }

  getHeaders() {
    const { observability } = this.pub.bindings();
    this.pub['headers'] = {
      'consumer-id': observability.consumer_id,
      'flow-id': observability.flow_id,
      'trace-id': observability.trace_id
    };
    return {
      'consumer-id': observability.consumer_id,
      'flow-id': observability.flow_id,
      'trace-id': observability.trace_id
    };
  }
}
