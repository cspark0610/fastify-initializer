import { Server } from './server';
import { EventEmitter } from 'events';

const PORT = Number(process.env['PORT'] || 3000);
const HOST = '0.0.0.0';

EventEmitter.setMaxListeners(20);
const start = async () => {
  const server = new Server();
  await server.start({
    host: HOST,
    port: PORT
  });

  console.log(`Server is up on port ${PORT}`);
};

start();
