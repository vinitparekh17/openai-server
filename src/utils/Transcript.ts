import Template from '../lib/handlebar';
import { Logger } from './';
import MessageSchema from '../models/Message.schema';

export class Transcript {
  static async ganerate(id: string): Promise<string | null> {
    try {
      let data = await MessageSchema.find({user: id});
      if (data.length == 0) {
        return null;
      }
      return Template(data);
    } catch (error) {
      Logger.error(error);
    }
  }
}
