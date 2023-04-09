import express, { Application, NextFunction, Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";
import { ErrorHandler } from "./utils/Middlewaresl";
import cors from "cors";
import * as dotenv from "dotenv";
import { ErrorRes } from "./utils/Responders";
import { connectDB } from './utils/Database'
dotenv.config();
connectDB();


const app: Application = express();
import { rateLimit } from "express-rate-limit";

// middlewares
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

// openai initialization
const { OPENAI_API_KEY  } = process.env;
const configOpenai = new Configuration({
  apiKey: OPENAI_API_KEY,
  basePath: "https://api.openai.com/v1",
});
const openai = new OpenAIApi(configOpenai);
// routes
import userRoutes from "./routes/user";
import chatRoutes from "./routes/chat";

app.use("/api/user", userRoutes);
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