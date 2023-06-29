import { Schema, model } from 'mongoose';
import { RobotDocument, RobotModel } from '../types';

const RobotSchema = new Schema<RobotDocument>({
  name: {
    type: String,
    required: [true, 'Name is required!'],
    trim: true,
  },
  avatar: {
    type: Number,
    required: true,
    default: 0,
  },
  botType: {
    type: String,
    required: true,
    default: 'general',
    enum: ['general', 'trainer', 'coder', 'financial advisor', 'mentor'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required!'],
    enum: {
      values: ['male', 'female'],
      message: 'Please choose valid gender!',
    },
  },
  preprompt: {
    type: String,
    required: true,
    default: 'Please generate a completion for the given text',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default model<RobotDocument, RobotModel>('Robot', RobotSchema);
