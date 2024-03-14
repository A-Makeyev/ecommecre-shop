import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import { getProducts, getProductById, createProduct } from '../controllers/productController.js'


const router = express.Router()

router.get('/:id', getProductById)
router.get('/', getProducts)
      .post(protect, admin, createProduct)

export default router