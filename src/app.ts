import express from 'express';
import { cpus, arch, machine, platform } from 'node:os';
import type { Application, Request, Response } from 'express';
import { Middlewares, SocketMiddleware } from './middlewares';
import Mongodb from './lib/Db';
import userRoutes from './routes/user';
import chatRoutes from './routes/chat';
import paymentRoutes from './routes/payment';

export const app: Application = express();

Mongodb.init();
Middlewares.init();
setTimeout(() => {
  SocketMiddleware.init();
}, 1000);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running!',
    cpus: cpus().length,
    arch: arch(),
    machine: machine(),
    platform: platform(),
  });
});
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('*', (req: Request, res: Response) => {
  const err = Error(`Requested path: ${req.path} not found!`);
  res.status(404).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
});
