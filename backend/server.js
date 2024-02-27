import express from 'express'
import dotenv from 'dotenv'
import connectMongoDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'


dotenv.config()
connectMongoDB()
const port = process.env.PORT || 5000
const app = express()

app.get('/', (request, response) => {
    response.send('<h1 style="text-align: center; margin-top: 20%;">Server is Running</h1>')
})

app.use('/api/products', productRoutes)
app.use(errorHandler)
app.use(notFound)

app.listen(port, () => console.log(`>>> Server is running on port ${port}`))
