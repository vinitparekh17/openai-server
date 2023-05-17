import { Schema, model } from 'mongoose';
import type { MessageDocument, MessageModel } from '../types/Message';

const messageSchema = new Schema<MessageDocument>({
  prompt: {
    content: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now() },
  },
  answer: {
    content: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now() },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
});

export default model<MessageDocument, MessageModel>('Message', messageSchema);
