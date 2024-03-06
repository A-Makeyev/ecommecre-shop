import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectMongoDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import colors from 'colors'


dotenv.config()
connectMongoDB()
const port = process.env.PORT || 5000
const app = express()

// body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// body cookie middleware
app.use(cookieParser())

app.get('/', (request, response) => {
    response.send('<h1 style="text-align: center; margin-top: 20%;">Server is Running</h1>')
})

app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/products', productRoutes)
app.use(errorHandler)
app.use(notFound)

app.listen(port, () => console.log(` >>> Server is running on port ${port} `.blue.bold.inverse))
