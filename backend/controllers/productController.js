import asyncHandler from '../middleware/asyncHandler.js'
import Product from '../models/productModel.js'


// @desc Fetch all products
// @route (GET) /api/products
// @access Public
const getProducts = asyncHandler(async (request, response) => {
    const products = await Product.find({})
    response.json(products)
})

// @desc Fetch a single product
// @route (GET) /api/products/:id
// @access Public
const getProductById = asyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id)
    if (product) {
        return response.json(product)
    } else {
        response.status(404)
        throw new Error('Resource Not Found')
    }
})

// @desc Create product
// @route (POST) /api/products
// @access Admin
const createProduct = asyncHandler(async (request, response) => {
    const product = new Product({
        user: request.user._id,
        name: 'Sample Product',
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample Category', 
        description: 'Sample Description', 
        numReviews: 0, 
        price: 0,
        countInStock: 0 
    })

    const createdProduct = await product.save()
    response.status(201).json(createdProduct)
})

export { getProducts, getProductById, createProduct }