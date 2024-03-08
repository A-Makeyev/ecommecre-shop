import { toast, Slide } from 'react-toastify'


export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
}

export const addCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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

export const quantityAlert = (qty) => {
    return (qty === 1 || qty < 1 || ((qty < 10) && (qty > 1)))
        ? "quantity-alert-text xs-price-width-100 mt-1 pe-0 fs-5"
        : "xs-price-width-100 mt-1 pe-0 fs-5"
}

export const alertText = (qty) => {
    return ((qty < 11) && (qty > 1))
        ? `Only ${qty} Left`
        : qty === 1 ? "Last One"
            : qty < 1 ? "Out of Stock"
                : ""
}

export const addedToCartMessage = (qty, item) => {
    item = item.split(' ', 3).join(' ')
    const randomValue = (array) => { return array[~~(Math.random() * array.length)] }
    const positions = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']
    const emojis = ['🥳', '✨', '🤩', '🔥', '👀', '👌🏼']
    const product = qty === 1 ? `${item} was` : `(${qty}) ${item} were`
    toast.success(`${product} added to your shopping cart ${randomValue(emojis)}`,
        // https://fkhadra.github.io/react-toastify/introduction
        {
            position: randomValue(positions),
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Slide,
        }
    )
}