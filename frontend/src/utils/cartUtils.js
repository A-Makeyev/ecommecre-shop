import { toast, Slide } from 'react-toastify'
import { CURRENCY_SYMBOL } from '../constants'


export const adjustPrice = (num) => {
    return CURRENCY_SYMBOL + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

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

export const formatDateAndTime = (date, includeTime) => {
    date = new Date(date)
    let time = date.toLocaleString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    })
    let dateAndTimeString = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ~ ${time}`
    if (includeTime) {
        return dateAndTimeString
    }
    return dateAndTimeString.substring(0, 10)
}

export const getCurrentDateAndTime = (includeTime, US) => {
    let date = new Date()
    let dd = String(date.getDate()).padStart(2, '0')
    let mm = String(date.getMonth() + 1).padStart(2, '0')
    let yyyy = date.getFullYear()
    let time = date.toLocaleString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    })

    let dateAndTimeString = (US ? `${mm}/${dd}/${yyyy}` : `${dd}/${mm}/${yyyy}`) + ` ~ ${time}`
    if (includeTime) {
        return dateAndTimeString
    }
    return dateAndTimeString.substring(0, 10)
}

export const timeSince = (time) => {
    time = new Date(time)

    switch (typeof time) {
        case 'number':
            break
        case 'string':
            time = +new Date(time)
            break
        case 'object':
            if (time.constructor === Date) time = time.getTime()
            break
        default:
            time = +new Date()
    }

    var time_formats = [
        [60, 'seconds', 1], // 60
        [120, '1 minute ago', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ]
    
    var seconds = (+new Date() - time) / 1000,
        token = 'ago',
        list_choice = 1

    if (seconds < 1) {
        return 'Just now'
    }
    
    if (seconds < 0) {
        seconds = Math.abs(seconds)
        token = 'from now'
        list_choice = 2
    }

    var i = 0, format
    while (format = time_formats[i++])
        if (seconds < format[0]) {
            if (typeof format[2] == 'string')
                return format[list_choice]
            else
                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token
        }
        
    format = time_formats[time_formats.length - 1]
    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token
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
    item = item.split(' ', 4).join(' ')
    const randomValue = (array) => { return array[~~(Math.random() * array.length)] }
    const positions = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']
    const emojis = ['🥳', '✨', '🤩', '🔥', '👀', '👌🏼']
    const product = qty === 1 ? `${item} was` : `(${qty}) ${item} were`
    toast.success(`${product} added to your cart ${randomValue(emojis)}`,
        // https://fkhadra.github.io/react-toastify/introduction
        {
            position: randomValue(positions),
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Slide,
        }
    )
}
