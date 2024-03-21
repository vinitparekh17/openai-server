import { Schema, model } from 'mongoose';
import type { MessageDocument, MessageModel } from '../interface';
import { NextFunction } from 'express';

const messageSchema = new Schema<MessageDocument>({
  prompt: {
    type: String,
    required: [true, 'Prompt is required!'],
  },
  answer: {
    type: String,
    required: [true, 'Answer is required!'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

messageSchema.pre<MessageDocument>('find', function(next: NextFunction) {
  this.populate('user', 'name')
  next()
})

export default model<MessageDocument, MessageModel>('Message', messageSchema);
