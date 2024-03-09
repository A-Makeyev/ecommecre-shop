import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
} from '../controllers/orderController.js'

const router = express.Router()

// api/orders
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders)

// router.route('/mine').get(protect, getMyOrders)
router.get('/mine', protect, getMyOrders)

// router.route('/:id').get(protect, getOrderById)
router.get('/:id', protect, getOrderById)

// router.route('/:id/pay').put(protect, admin, updateOrderToPaid)
router.put('/:id/pay', protect, admin, updateOrderToPaid)

// router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered)

export default router