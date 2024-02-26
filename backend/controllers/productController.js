import asyncHandler from '../middleware/asyncHandler.js'
import Product from '../models/productModel.js'

// @desc Fetch all products
// @route /api/products
// @access public
const getProducts = asyncHandler(async (request, response) => {
    const products = await Product.find({})
    response.send(products)
})

// @desc Fetch a single product
// @route /api/products/:id
// @access public
const getProductById = asyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id)
    if (product) {
        return response.json(product)
    } else {
        response.status(404)
        throw new Error('Resource Not Found')
    }
})

export { getProducts, getProductById }