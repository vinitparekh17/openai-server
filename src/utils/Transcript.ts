import Template from '../lib/Handlebars';
import Logger from './Logger';
import MessageSchema from '../models/Message.schema';
import DataProvider from './Dataprovider';

export default class Transcript {
  static async ganerate(id: string): Promise<string | null> {
    try {
      let data = await DataProvider.getDataBySearch(MessageSchema, 'user', id);
      if (data.length == 0) {
        return null;
      }
      return Template(data);
    } catch (error) {
      Logger.error(error);
    }
  }
}
