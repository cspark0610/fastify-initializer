import { AsyncLocalStorage } from 'async_hooks';

type Context = { sessionId: string };
export const asyncLocalStorage = new AsyncLocalStorage<Context>();
