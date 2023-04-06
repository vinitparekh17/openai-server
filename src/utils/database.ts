import { connect, Error, Mongoose } from 'mongoose'

export const connectDB = async () => {
    try {
        let options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            autoIndex: false,
            poolSize: 10,
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
