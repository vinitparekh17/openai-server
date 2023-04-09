import express, { Application, Request, Response } from "express";

const app: Application = express();

// routes
import userRoutes from "./routes/user";
import chatRoutes from "./routes/chat";

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use('*', (req: Request, res: Response) => {
  const err = Error(`Requested path: ${req.path} not found!`);
  res.status(404).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
});

export default app;