import asyncHandler from '../middleware/asyncHandler.js'
import Product from '../models/productModel.js'


// @desc Fetch all products
// @route (GET) /api/products
// @access Public
const getProducts = asyncHandler(async (request, response) => {
    const keyword = request.query.keyword ? { name: { $regex: request.query.keyword, $options: 'i' } } : {}
    const page = Number(request.query.pageNumber) || 1
    const pageSize = 12

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))

    response.json({ products, page, pages: Math.ceil(count / pageSize) })
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
        name: 'Product',
        description: 'Description',
        image: '/images/sample.jpg',
        category: 'Category',
        brand: 'Brand',
        countInStock: 0,
        numReviews: 0,
        price: 0
    })

    const createdProduct = await product.save()
    response.status(201).json(createdProduct)
})

// @desc Update product
// @route (PUT) /api/products/:id
// @access Admin
const updateProduct = asyncHandler(async (request, response) => {
    const { name, description, image, category, brand, countInStock, price } = request.body
    const product = await Product.findById(request.params.id)
    if (product) {
        product.name = name,
            product.description = description
        product.image = image
        product.category = category
        product.brand = brand
        product.countInStock = countInStock
        product.price = price

        const updatedProduct = await product.save()
        response.json(updatedProduct)
    } else {
        response.status(404)
        throw new Error('Resource Not Found')
    }
})

// @desc Delete product
// @route (DELETE) /api/products/:id
// @access Admin
const deleteProduct = asyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id)
    if (product) {
        await Product.deleteOne({ _id: product._id })
        response.status(200).json({
            message: `${product.name.split(' ', 3).join(' ')} was deleted`
        })
    } else {
        response.status(404)
        throw new Error('Resource Not Found')
    }
})

// @desc Create Product Review
// @route (DELETE) /api/products/:id
// @access Private
const createProductReview = asyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id)
    const { rating, comment } = request.body

    if (product) {
        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === request.user._id.toString())
        if (alreadyReviewed) {
            response.status(400)
            throw new Error('You already reviewed this product')
        }

        const review = {
            user: request.user._id,
            name: request.user.name,
            rating: Number(rating),
            comment
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((accumulator, review) => accumulator + review.rating, 0) / product.reviews.length

        await product.save()
        response.status(201).json({ message: 'Added Review' })

    } else {
        response.status(404)
        throw new Error('Resource Not Found')
    }
})

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
}