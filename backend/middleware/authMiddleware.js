import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'


const protect = asyncHandler(async (request, response, next) => {
    // read the jwt from the cookie
    let token = request.cookies.jwt

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            request.user = await User.findById(decoded.userId).select('-password')
            next()
        } catch(error) {

        }
    } else {
        response.status(401)
        throw new Error('Not Authorized')
    }
})

const admin = (request, response, next) => {
    if (request.user && request.user.isAdmin) {
        next()
    } else {
        response.status(401)
        throw new Error('Not Authorized As Admin')
    }
}

export { protect, admin }