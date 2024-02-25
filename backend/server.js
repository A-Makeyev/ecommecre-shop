import express from 'express'
import dotenv from 'dotenv'
import products from './data/products.js'


const port = process.env.PORT || 5000
const app = express()

app.get('/', (request, response) => {
    response.send('Server is running..')
})

app.get('/api/products', (request, response) => {
    response.json(products)
})

app.get('/api/products/:id', (request, response) => {
    const product = products.find((product) => product._id == request.params.id)
    response.json(product)
})

app.listen(port, () => console.log(`>>> Server is running on port ${port}`))
