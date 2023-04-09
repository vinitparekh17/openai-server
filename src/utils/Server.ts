import app from '../app';
import Middleware from './Middlewares'
import Mongodb from './Database';
import { PORT } from '../config';

export default {
    start: () => {
        try {
            Mongodb.init()
            Middleware.init()
            app.listen(PORT, () => {
                console.log(`Server started on port ${process.env.PORT}`);
            });
        } catch (error) {
            console.log(error);   
        }
    }
}