import express, { Request, Response, NextFunction } from "express";
import { ApiError } from "./ErrorHandlers";
import cors from 'cors';
import { rateLimit } from "express-rate-limit";
import { ErrorRes } from "./Responders";
import app from "../app";

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
    app.use(rateLimit({
      windowMs: 1 * 60 * 1000, // 1min
      max: 3,
      handler: (req: Request, res: Response, next: NextFunction) => {
        new ErrorRes(res, 429, "Too many request, try again later!")
        next()
      }
    }))
    app.get('/', (req, res) => res.send('<h1>Jai shree ram</h1>'))
    app.use(express.json());
    app.use(cors({
      origin: "*",
    }));
    app.use(ErrorHandler.handle())
  }
}