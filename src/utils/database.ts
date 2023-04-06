import { connect, ConnectOptions } from 'mongoose'

export const connectDB = async () => {
    try {
        let options: ConnectOptions = {
            autoIndex: false,
            socketTimeoutMS: 30000,
            keepAlive: true,
        }
        await connect(process.env.MONGO_URI, options)
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
