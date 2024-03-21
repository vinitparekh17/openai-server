import type { Model, Document, Schema } from 'mongoose';

interface MessageFormat {
  content: string;
  timestamp: Date;
}

interface Message {
  prompt: MessageFormat;
  answer: MessageFormat;
  date: Date;
  user: {
    _id: Schema.Types.ObjectId;
    name: string;
  }
}

export interface MessageModel extends Model<MessageDocument> {}
export interface MessageDocument extends Message, Document {
  _id: string;
}
