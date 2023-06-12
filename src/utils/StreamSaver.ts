import Message from '.././models/Message.schema';
import { Logger } from './';

export class StramSaver {
    static async saveStream(from: string, prompt: string, res: string) {
        try {
            let message = new Message({
                prompt: prompt,
                answer: res,
                user: from
            });
            await message.save();
        } catch (error) {
            Logger.error(error);
        }
    }
}