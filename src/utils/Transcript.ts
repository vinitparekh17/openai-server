import MessageSchema from "../models/Message.schema"
import DataProvider from "./Dataprovider"

let MessageProvider = new DataProvider(MessageSchema);
export default {
    ganerate: (id: string) => {
        let data = MessageProvider.getDataByID(id);
        
    }
}