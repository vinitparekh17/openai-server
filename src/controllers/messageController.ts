import type { NextFunction, Request, Response } from 'express';
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
    // const completionPromise = openai.createChatCompletion({
    //   model: 'gpt-3.5-turbo',
    //   max_tokens: 200,
    //   temperature: 0.7,
    //   messages: [{ role: 'user', content: prompt }],
    //   n: 1,
    //   stream: true,
    // });
    // let gptResponse: string;
    // for (const chunk in completion) {
    //   if (chunk === 'data') {
    //     let raw = completion[chunk];
    //     let data = raw.toString().split('data: ');
    //     data.forEach((item: any) => {
    //       if (item !== '' && item !== '[DONE]\n\n') {
    //         let value = JSON.parse(item);
    //         gptResponse += value.choices[0].delta?.content;
    //       }
    //     });
    //   }
    // }
    return Success.send(res, 200, { message: 'Stream started' });
    // })
    // .catch((err) => {
    //   Err.send(res, 500, err);
    //   Logger.error('Openai err: ', err);
    // });
  }
);

export const getConversation = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await DataProvider.getData(messageSchema);
    if (!data) return Err.send(res, 404, 'Data not found!');
    return Success.send(res, 200, data);
  }
);
