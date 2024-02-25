import mongoose from 'mongoose'


const connectMongoDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`%c>>> Connected to MongoDB: ${con.connection.host}`, 'color: green')
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectMongoDB