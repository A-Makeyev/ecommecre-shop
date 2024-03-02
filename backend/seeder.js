import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectMongoDB from './config/db.js'
import users from './data/users.js'
import products from './data/products.js'


dotenv.config()
connectMongoDB()

const importData = async () => {
    try {
        await User.deleteMany()
        await Order.deleteMany()
        await Product.deleteMany()

        const createdUsers = await User.insertMany(users)
        const adminUser = createdUsers[0]._id
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser }
        })
        
        await Product.insertMany(sampleProducts)
        console.log(' DATA IMPORTED '.green.bold.inverse)
        process.exit()
    } catch (error) {
        console.log(` ${error} `.red.bold.inverse)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany()
        await Order.deleteMany()
        await Product.deleteMany()

        console.log(' DATA DESTROYED '.green.bold.inverse)
        process.exit()
    } catch (error) {
        console.log(` ${error} `.red.bold.inverse)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}
