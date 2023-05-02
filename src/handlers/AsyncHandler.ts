import type { Request, Response, NextFunction } from "express";
import { Err } from "../utils/Responders";

export default (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      Err.send(res, 500, err.message);
      next(err);
    });
  };
