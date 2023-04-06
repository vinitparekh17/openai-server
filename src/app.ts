import express, { Application, Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";
import { ErrorHandler } from "./utils/middleware";
import cors from "cors";
import * as dotenv from "dotenv";
import { connectDB } from './utils/database'
dotenv.config();

const app: Application = express();

// middlewares
app.use(express.json());
app.use(cors({
  origin: "*",
}));
app.use(ErrorHandler.handle())
connectDB();

// openai initialization
const { OPENAI_API_KEY  } = process.env;
const configOpenai = new Configuration({
  apiKey: OPENAI_API_KEY,
  basePath: "https://api.openai.com/v1/chat/completions",
});
const openai = new OpenAIApi(configOpenai);
// routes
import userRoutes from "./routes/user";
import chatRoutes from "./routes/chat";

app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use('*', (req: Request, res: Response) => {
  const err = Error(`Requested path: ${req.path} not found!`);
  res.status(404).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
});

export default app;
export { openai };