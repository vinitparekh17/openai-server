import express from "express";
import type { Request, Response, NextFunction } from "express";
import { app } from "../app";
import morgan, { StreamOptions } from "morgan";
import { ApiError } from "../handlers";
import cors from "cors";
import cookieParser from "cookie-parser";
import Logger from "../utils/Logger";

export class ErrorHandler {
  static handle = () => {
    return async (
      err: ApiError,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).send({
        success: false,
        message: err.message,
        stack: err.stack,
      });
      next();
    };
  };
}

export default {
  init: () => {
    try {
      let stream: StreamOptions = { write: (m) => Logger.http(m) };
      let skip = (): boolean => {
        var env = process.env.NODE_ENV || "development";
        return env !== "development";
      };
      app.use(
        morgan(
          ":method :url :status :res[content-length] - :response-time ms",
          { stream, skip }
        )
      );
      app.use(cookieParser());
      app.use(express.json());
      app.use(
        cors({
          origin: ["http://localhost:3000", "https://omnisive.technetic.co.in"],
          methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
          credentials: true,
        })
      );
      app.use(ErrorHandler.handle());
    } catch (error) {
      Logger.error(error);
    }
  },
};
