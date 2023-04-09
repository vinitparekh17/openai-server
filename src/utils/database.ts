import { connect, ConnectOptions } from 'mongoose'
import { MONGO_URI } from '../config'

export default {
    init: async () => {
        try {
            let options: ConnectOptions = {
                autoIndex: false,
                socketTimeoutMS: 30000,
                keepAlive: true,
            }
            await connect(MONGO_URI, options)
            console.log('MongoDB connected')
        } catch (error) {
            console.log(error)
            process.exit(1)
        }
    }
}
