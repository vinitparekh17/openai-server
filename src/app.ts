import express, { Application, Request, Response } from "express";
import Middleware from './utils/Middlewares';
import userRoutes from "./routes/user";
import chatRoutes from "./routes/chat";
import Logger from "./utils/Logger";
export const app: Application = express();
Middleware.init()

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.get("/logger", (_, res) => {
  Logger.error("This is an error log");
  Logger.warn("This is a warn log");
  Logger.info("This is a info log");
  Logger.http("This is a http log");
  Logger.debug("This is a debug log");
  res.send("Hello world");
});
app.use('*', (req: Request, res: Response) => {
  const err = Error(`Requested path: ${req.path} not found!`);
  res.status(404).json({
    success: false,
    message: err.message,
    stack: err.stack
  });
});