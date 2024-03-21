import { connect, ConnectOptions } from 'mongoose';
import { MONGO_URI } from '../../config';
import { Logger } from '../../utils';

export default class MongoDB {
  static async init() {
    try {
      let options: ConnectOptions = {
        autoIndex: false,
        socketTimeoutMS: 30000,
        keepAlive: true,
      };
      await connect(MONGO_URI, options);
      Logger.info('MongoDB connected...');
    } catch (error: unknown) {
      error instanceof Error && console.error(error.message);
      process.exit(1);
    }
  }
}
