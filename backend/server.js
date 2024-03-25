import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import connectMongoDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import colors from 'colors'


dotenv.config()
connectMongoDB()

const app = express()
const port = process.env.PORT || 5000
const __dirname = path.resolve() // set __dirname to current directory

// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://ecommecre-shop.onrender.com')

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next()
})

// body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// body cookie middleware
app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/products', productRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// https://developer.paypal.com/dashboard/accounts
app.use('/api/config/paypal', (request, response) => response.send({ clientId: process.env.PAYPAL_CLIENT_ID }))

if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    
    // any route that is not api will be redirected to index.html
    app.get('*', (request, response) => response.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
} else {
    app.get('/', (request, response) => response.send('<h1 style="text-align: center margin-top: 20%">Server is Running</h1>'))
}

app.use(errorHandler)
app.use(notFound)

app.listen(port, () => console.log(` >>> Server is running on port ${port} `.blue.bold.inverse))