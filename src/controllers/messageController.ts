import type { Request, Response } from 'express';
import { AsyncHandler } from '../handlers';
import { DataProvider } from '../utils/';
import messageSchema from '../models/Message.schema';
import { Err, Success } from '../utils/Responders';

export const getConversation = AsyncHandler(
  async (_req: Request, res: Response) => {
    const data = await DataProvider.getData(messageSchema);
    if (!data) return Err.send(res, 404, 'Data not found!');
    return Success.send(res, 200, data);
  }
);
