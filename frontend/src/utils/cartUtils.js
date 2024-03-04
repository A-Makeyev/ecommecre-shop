import { Slide } from 'react-toastify'


export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
}

export const updateCart = (state) => {
    const freeShippingPrice = 100, tax = 0.15

    // calculate items price
    state.itemsPrice = addDecimals(state.cartItems.reduce((accumulator, item) => accumulator + item.price * item.qty, 0))

    // calculate shipping price (free for orders over 100)
    state.shippingPrice = addDecimals(state.itemsPrice > freeShippingPrice ? 0 : 10)

    // calculate tax price (add 15% to item's price)
    state.taxPrice = addDecimals(Number((tax * state.itemsPrice).toFixed(2)))

    // calculate total price
    state.totalPrice = (
        Number(state.itemsPrice)
        + Number(state.shippingPrice)
        + Number(state.taxPrice)
    ).toFixed(2)

    localStorage.setItem('cart', JSON.stringify(state))
    return state
}

export const getRandomEmoji = () => {
    const emojis = ['🥳', '✨', '🤩', '🔥']
    return emojis[~~(Math.random() * emojis.length)]
}

// https://fkhadra.github.io/react-toastify/introduction
export const addedToCartToastOptions = {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Slide,
}