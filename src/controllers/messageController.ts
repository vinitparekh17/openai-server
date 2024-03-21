import type { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { AsyncHandler } from '../handlers';
import messageSchema from '../models/Message.schema';
import { Err, Success } from '../utils/Responders';

export const getConversation = AsyncHandler(
  async (req: Request, res: Response) => {
    const { uid } = req.params;
    if (isValidObjectId(uid)) {
      const data = await messageSchema.find({ user: uid });
      if (!data) return Err.send(res, 404, 'Data not found!');
      return Success.send(res, 200, data);
    }
  },
);
