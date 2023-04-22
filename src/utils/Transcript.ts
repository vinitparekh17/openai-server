import Template from '../lib/Handlebars'
import Logger from "./Logger";
import MessageSchema from '../models/Message.Schema';
import DataProvider from './Dataprovider';

let MessageProvider = new DataProvider(MessageSchema);

export default {
    ganerate: async (id: string): Promise<string | null> => {
        try {
            let data = await MessageProvider.getDataBySearch('user', id);
            if (data.length == 0) {
                return null
            }
            return Template(data);
        } catch (error) {
            Logger.error(error)
        }
    }
}