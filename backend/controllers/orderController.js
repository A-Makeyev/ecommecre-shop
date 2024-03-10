
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
// @route (PUT) /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (request, response) => {
    const order = await Order.findById(request.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = getCurrentDateAndTime()
        order.paymentResult = {
            id: request.body.id,
            status: request.body.status,
            update_time: request.body.update_time,
            email_address: request.body.payer.email_address
        }

        const updatedOrder = await order.save()
        response.status(200).json(updatedOrder)
    } else {
        response.status(404)
        throw new Error('Order Not Found')
    }

})

// @desc Update order to delivered
// @route (PUT) /api/orders/:id/deliver
// @access Private & Admin
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