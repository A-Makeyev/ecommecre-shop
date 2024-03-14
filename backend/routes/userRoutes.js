import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
    authenticateUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser
} from '../controllers/userController.js'

const router = express.Router()

// /api/users
router.post('/auth', authenticateUser)
router.post('/logout', logoutUser)

router.route('/')
      .post(registerUser)
      .get(protect, admin, getUsers)

router.route('/profile')
      .get(protect, getUserProfile)
      .put(protect, updateUserProfile)
    
router.route('/:id')
      .delete(protect, admin, deleteUser)
      .get(protect, admin, getUserById)
      .put(protect, admin, updateUser)

export default router