import { createSlice } from '@reduxjs/toolkit'
import { updateCart } from '../utils/cartUtils'


const localCart = localStorage.getItem('cart')
const initialState = localCart
    ? JSON.parse(localCart)
    : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' }

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload
            const existItem = state.cartItems.find((i) => item._id === i._id)

            if (existItem) {
                state.cartItems = state.cartItems.map((i) => i._id === existItem._id ? item : i)
            } else {
                state.cartItems = [...state.cartItems, item]
            }
            return updateCart(state)
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((i) => i._id !== action.payload)
            return updateCart(state)
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload
            return updateCart(state)
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
            return updateCart(state)
        },
        clearCartItems: (state, action) => {
            state.cartItems = []
            return updateCart(state)
        },
    },
})

export default cartSlice.reducer
export const { 
    addToCart, 
    removeFromCart, 
    saveShippingAddress, 
    savePaymentMethod, 
    clearCartItems 
} = cartSlice.actions