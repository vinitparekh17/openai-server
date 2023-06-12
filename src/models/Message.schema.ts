import { Schema, model } from 'mongoose';
import type { MessageDocument, MessageModel } from '../types';

const messageSchema = new Schema<MessageDocument>({
  prompt: { type: String, required: true },
  answer: { type: String, required: true },
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
