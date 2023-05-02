import type { NextFunction, Request, Response } from "express";
import { openai } from "../lib/Openai";
import { AsyncHandler } from "../handlers";
import DataProvider from "../utils/Dataprovider";
import messageSchema from "../models/Message.schema";
import { Err, Success } from "../utils/Responders";
import Logger from "../utils/Logger";
import { io } from "../lib/Socket";

export const generateResponse = AsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    let { prompt } = req.body;
    let { id } = req.params;
    const completionPromise = openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 200,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
      n: 1,
      user: id,
      stream: true,
    });

    io.on("connect", () => {
      Logger.debug("connected to socket!");
      completionPromise
        .then((completion) => io.emit("create_completion", completion))
        .catch((err) => Logger.error(err));

      io.on("data", (data) => io.emit("completion", data.choices[0].text));
      io.on("error", (e) => Logger.error(e));
      io.on("disconnect", () => Logger.debug("Disconnected from socket!"));
    });
  }
);

export const getConversation = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await DataProvider.getData(messageSchema);
    if (!data) return Err.send(res, 404, "Data not found!");
    return Success.send(res, 200, data);
  }
);
