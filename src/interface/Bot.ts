import type { Model, Document, Schema } from 'mongoose';

interface Bot {
  name: string;
  botType: string;
  gender: string;
  preprompt: string;
  avatar: number;
  user: Schema.Types.ObjectId;
}
export interface BotModel extends Model<BotDocument> {}
export interface BotDocument extends Bot, Document {
  _id: string;
}
