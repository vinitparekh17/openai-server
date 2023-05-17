import type { NextFunction, Request, Response } from 'express';
import { openai } from '../lib/Openai';
import { AsyncHandler } from '../handlers';
import DataProvider from '../utils/Dataprovider';
import messageSchema from '../models/Message.schema';
import { Err, Success } from '../utils/Responders';
import Logger from '../utils/Logger';
import { socketServer } from '../utils/Server';

export const generateResponse = AsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    let { prompt } = req.body;
    let { id } = req.params;
    const completionPromise = openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      max_tokens: 200,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
      n: 1,
      user: id,
      stream: true,
    });
    Logger.debug('connected to socket!');
    completionPromise
      .then((completion) =>
        socketServer.streamData(completion.data.choices[0].message, id)
      )
      .catch((err) => Logger.error(err));
  }
);

export const getConversation = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await DataProvider.getData(messageSchema);
    if (!data) return Err.send(res, 404, 'Data not found!');
    return Success.send(res, 200, data);
  }
);
