import express from 'express';
import { app } from '../app';
import morgan, { StreamOptions } from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Logger } from '../utils/';
import { ErrorHandler } from './err.middleware';

class Middlewares {
  static init() {
    try {
      let stream: StreamOptions = { write: (m) => Logger.http(m) };
      let skip = (): boolean => {
        var env = process.env.NODE_ENV || 'development';
        return env !== 'development';
      };
      app.use(
        morgan(
          ':method :url :status :res[content-length] - :response-time ms',
          {
            stream,
            skip,
          },
        ),
      );
      app.use(cookieParser());
      app.use(express.json());
      app.use(
        cors({
          origin: ['http://localhost:3000', 'https://omnisive.technetic.co.in'],
          credentials: true,
        }),
      );
      app.use(ErrorHandler.handle());
    } catch (error) {
      Logger.error(error);
    }
  }
}
export { Middlewares, ErrorHandler };
export { AuthMiddleware } from './auth.middleware';
export { SocketMiddleware } from './socket.middleware';
