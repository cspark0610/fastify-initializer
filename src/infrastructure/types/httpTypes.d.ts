/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'undici';

export type RequestType<T> = {
  pathParams?: Record<string, any>;
  queryParams?: Record<string, any>;
  body?: T;
};

export type ResponseType<T> = Response<T>;
