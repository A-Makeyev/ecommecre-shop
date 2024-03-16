import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'


// @desc Authenticate user and get token
// @route (POST) /api/users/login
// @access Public
const authenticateUser = asyncHandler(async (request, response) => {
    const { email, password } = request.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        generateToken(response, user._id)
        response.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        response.status(401)
        throw new Error('Invalid Email or Password')
    }
})

// @desc Register new user
// @route (POST) /api/users
// @access Public
const registerUser = asyncHandler(async (request, response) => {
    const { name, email, password } = request.body
    const userExists = await User.findOne({ email })

    if (userExists) {
        response.status(400)
        throw new Error(`User With Email '${email}' Already Exists`)
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        generateToken(response, user._id)
        response.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        response.status(401)
        throw new Error('Invalid User Data')
    }
})

// @desc Logout user and clear cookies
// @route (POST) /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (request, response) => {
    response.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    response.status(200).json({ message: 'Logged Out' })
})

// @desc Get user profile
// @route (GET) /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (request, response) => {
    const user = await User.findById(request.user._id)

    if (user) {
        response.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        response.status(404)
        throw new Error(`User '${request.user.name}' Not Found`)
    }
})

// @desc Update user profile
// @route (PUT) /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (request, response) => {
    const user = await User.findById(request.user._id)

    if (user) {
        user.name = request.body.name || user.name
        user.email = request.body.email || user.email

        if (request.body.password) {
            user.password = request.body.password
        }

        const updatedUser = await user.save()
        response.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        response.status(404)
        throw new Error(`User '${request.user.name}' Not Found`)
    }
})

// @desc Get users
// @route (GET) /api/users
// @access Admin
const getUsers = asyncHandler(async (request, response) => {
    const users = await User.find({})
    response.status(200).json(users)
})

// @desc Get user by ID
// @route (GET) /api/users/:id
// @access Admin
const getUserById = asyncHandler(async (request, response) => {
    const user = await User.findById(request.params.id).select('-password')

    if (user) {
        response.status(200).json(user)
    } else {
        response.status(404)
        throw new Error('User Not Found')
    }
})

// @desc Delete users
// @route (DELETE) /api/users/:id
// @access Admin
const deleteUser = asyncHandler(async (request, response) => {
    const user = await User.findById(request.params.id)

    if (user) {
        if (user.isAdmin) {
            response.status(400)
            throw new Error('Cannot Delete Admin User')
        }
        await User.deleteOne({ _id: user._id })
        response.status(200).json({ message: `Deleted User '${user.name}' Successfully` })
    } else {
        response.status(404)
        throw new Error('User Not Found')
    }
})

// @desc Update user
// @route (PUT) /api/users/:id
// @access Admin
const updateUser = asyncHandler(async (request, response) => {
    const user = await User.findById(request.params.id)

    if (user) {
        user.name = request.body.name || user.name
        user.email = request.body.email || user.email
        user.isAdmin = Boolean(request.body.isAdmin)

        const updatedUser = await user.save()
        response.status(200).json(updatedUser)
    } else {
        response.status(404)
        throw new Error('User Not Found')
    }
})

export {
    authenticateUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser
}