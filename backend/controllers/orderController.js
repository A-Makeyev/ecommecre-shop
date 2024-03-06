import asyncHandler from '../middleware/asyncHandler.js'
import Product from '../models/productModel.js'

// @desc Create new order
// @route (POST) /api/orders
// @access Private
const addOrderItems = asyncHandler(async (request, response) => {
    response.send('add orders')
})

// @desc Get logged in user's orders
// @route (GET) /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (request, response) => {
    response.send('get orders')
})

// @desc Get order by ID
// @route (GET) /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (request, response) => {
    response.send('get order id')
})

// @desc Update order to payed
// @route (GET) /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (request, response) => {
    response.send('updateOrderToPaid')
})

// @desc Update order to delivered
// @route (GET) /api/orders/:id/deliver
// @access Admin
const updateOrderToDelivered = asyncHandler(async (request, response) => {
    response.send('updateOrderToDelivered')
})

// @desc Get all orders
// @route (GET) /api/orders/
// @access Admin
const getOrders = asyncHandler(async (request, response) => {
    response.send('getAllOrders')
})

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
}