import mongoose from 'mongoose'
import colors from 'colors'


const connectMongoDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI)
        console.log(` >>> Connected to MongoDB: ${con.connection.host} `.blue.bold.inverse)
    } catch (error) {
        console.log(`Error: ${error.message}`.red.bold.inverse)
        process.exit(1)
    }
}

export default connectMongoDB