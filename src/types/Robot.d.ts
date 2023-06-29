import type { Model, Document, Schema } from 'mongoose';

interface Robot {
  name: string;
  botType: string;
  gender: string;
  preprompt: string;
  avatar: number;
  user: Schema.Types.ObjectId;
}

export interface RobotModel extends Model<RobotDocument> {}
export interface RobotDocument extends Robot, Document {
  _id: string;
}
