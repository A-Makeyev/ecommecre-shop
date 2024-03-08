import asyncHandler from '../middleware/asyncHandler.js'
import Order from '../models/orderModel.js'

// @desc Create new order
// @route (POST) /api/orders
// @access Private
const addOrderItems = asyncHandler(async (request, response) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        shippingPrice,
        itemsPrice,
        taxPrice,
        totalPrice
    } = request.body

    if (orderItems && orderItems.length === 0) {
        response.status(400)
        throw new Error('Empty Order')
    } else {
        const items = orderItems.map((item) => ({
            ...item,
            product: item._id,
            _id: undefined
        }))

        const order = new Order({
            user: request.user._id,
            orderItems: items,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        })

        const createdOrder = await order.save()
        response.status(201).json(createdOrder)
    }

    response.send('add orders')
})

// @desc Get logged in user's orders
// @route (GET) /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (request, response) => {
    const orders = await Order.find({ user: request.user._id })
    response.status(200).json(orders)
})

// @desc Get order by ID
// @route (GET) /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (request, response) => {
    const order = await Order.findById(request.params.id).populate('user', 'name email')
    if (order) {
        response.status(200).json(order)
    } else {
        response.status(404)
        throw new Error('Order Not Found')
    }
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