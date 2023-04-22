import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { app } from '../app';
import morgan, { StreamOptions } from 'morgan';
import { ApiError } from '../utils/ErrorHandlers';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { Err } from '../utils/Responders';
import Logger from '../utils/Logger';

export class ErrorHandler {
  static handle = () => {
    return async (err: ApiError, req: Request, res: Response, next: NextFunction) => {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).send({
        success: false,
        message: err.message,
        stack: err.stack,
      });
      next()
    };
  };
}

export default {
  init: () => {
    try {
      app.use(rateLimit({
        windowMs: 1 * 60 * 1000, // 1min
        max: 5,
        handler: (req: Request, res: Response, next: NextFunction) => {
          Err.send(res, 429, "Too many request, try again later!")
          next()
        }
      }))
      let stream: StreamOptions = { write: m => Logger.http(m) }
      let skip = (): boolean => {
        var env = process.env.NODE_ENV || 'development'
        return env !== 'development'
      }
      app.use(morgan(
        ":method :url :status :res[content-length] - :response-time ms",
        { stream, skip }
      ))
      app.use(express.json());
      app.use(cors({
        origin: "*",
      }));
      app.use(ErrorHandler.handle())
    } catch (error) {
      Logger.error(error)
    }
  }
}