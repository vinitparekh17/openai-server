import { app } from '../app';
import Mongodb from './Database';
import Logger from './Logger';
import { PORT } from '../config';

export default {
    start: () => {
        try {
            Mongodb.init()
            app.listen(PORT, () => {
                Logger.debug(`Server started on port ${process.env.PORT}`);
            });
        } catch (error) {
            console.log(error);   
        }
    }
}