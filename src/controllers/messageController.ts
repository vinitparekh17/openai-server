import type { NextFunction, Request, Response } from 'express';
import { StreamFormat } from '../types';
import { openai } from '../lib/Openai';
import { AsyncHandler } from '../handlers';
import { DataProvider } from '../utils/';
import messageSchema from '../models/Message.schema';
import { Err, Success } from '../utils/Responders';
import { Logger } from '../utils/';
import { socketServer } from '../';

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
    let resultArr: StreamFormat[] = [];
    let gptResponse: string;
    completionPromise
      .then((completion) => {
        for (const chunk in completion) {
          if (chunk === 'data') {
            let raw = completion[chunk];
            let data = raw.toString().split('data: ');
            data.forEach((item: any) => {
              if (item !== '' && item !== '[DONE]\n\n') {
                resultArr.push(JSON.parse(item));
                resultArr.map(
                  (item) => (gptResponse += item.choices[0].delta?.content)
                ),
                  socketServer.streamData({
                    status: 'steaming',
                    data: gptResponse,
                  });
              } else if (item === '[DONE]\n\n') {
                socketServer.streamData({ status: 'done' });
              }
            });
          }
        }
        return Success.send(res, 200, { message: 'Stream started' });
      })
      .catch((err) => {
        Err.send(res, 500, err);
        Logger.error('Openai err: ', err);
      });
  }
);

export const getConversation = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await DataProvider.getData(messageSchema);
    if (!data) return Err.send(res, 404, 'Data not found!');
    return Success.send(res, 200, data);
  }
);
