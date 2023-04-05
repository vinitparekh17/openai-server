import express from "express";
import * as dotenv from "dotenv";
import * as cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const { OPENAI_API_KEY  } = process.env;

const configOpenai = new Configuration({
  apiKey: OPENAI_API_KEY,
  basePath: "https://api.openai.com/v1/chat/completions",
});

const openai = new OpenAIApi(configOpenai);

import userRoutes from "./routes/user";
import chatRoutes from "./routes/chat";

app.use("/api", userRoutes);
app.use("/api", chatRoutes);

export default app;
export { openai };