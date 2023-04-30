import express from 'express';
import type { Application, Request, Response } from "express";
import Middleware from './middlewares';
import userRoutes from "./routes/user";
import chatRoutes from "./routes/chat";

export const app: Application = express();
Middleware.init()

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use('*', (req: Request, res: Response) => {
  const err = Error(`Requested path: ${req.path} not found!`);
  res.status(404).json({
    success: false,
    message: err.message,
    stack: err.stack
  });
});