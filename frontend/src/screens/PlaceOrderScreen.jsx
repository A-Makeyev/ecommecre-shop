import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button, Card, ListGroup, Image } from 'react-bootstrap'
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice'
import { addCommas } from '../utils/cartUtils'
import { toast } from 'react-toastify'
import CheckoutSteps from '../components/CheckoutSteps'
import GoBackButton from '../components/GoBackButton'
import Message from '../components/Message'
import Loader from '../components/Loader'


const PlaceOrderScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cart = useSelector(state => state.cart)
    const [createOrder, { isLoading, error }] = useCreateOrderMutation()

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping')
        } else if (!cart.paymentMethod) {
            navigate('/payment')
        }
    }, [cart.shippingAddress.address, cart.paymentMethod, navigate])

    const placeOrderHandler = async () => {
        try {
            const response = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            }).unwrap()
            dispatch(clearCartItems())
            navigate(`/order/${response._id}`)
            toast.success(response)
        } catch (error) {
            toast.error(error)
        }
    }

    const totalItems = cart.cartItems.reduce((accumulator, item) => accumulator + item.qty, 0)

    return (
        <>
            <Row>
                <Col md={3} lg={2}>
                    <GoBackButton url="/payment" />
                </Col>
                <Col sm={13} md={11} lg={8} xl={7} className="mt-3">
                    <CheckoutSteps one two three />
                </Col>
            </Row>
            <Row>
                <Col md={10} lg={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Row>
                                <h3>Shipping Address</h3>
                                <p className="fs-5">
                                    {' '} {cart.shippingAddress.address}, {cart.shippingAddress.city},
                                    {' '} {cart.shippingAddress.country}, {cart.shippingAddress.postalCode}
                                </p>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <h3>Payment Method</h3>
                                <p className="fs-5">
                                    {' '} {cart.paymentMethod}
                                </p>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h3>Total Items</h3>
                            {cart.cartItems.length === 0 ? (
                                <Message variant="none" className="p-0">
                                    <h5>You have no saved items yet</h5>
                                </Message>
                            ) : (
                                <ListGroup>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index} className="border rounded mb-2">
                                            <Row className="ms-text-center">
                                                <Col md={4} lg={2}>
                                                    <Link to={`/product/${item._id}`}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Link>
                                                </Col>
                                                <Col md={5} lg={7} className="mt-1">
                                                    <Link to={`/product/${item._id}`}>
                                                        <strong>{item.name}</strong>
                                                    </Link>
                                                </Col>
                                                <Col md={2} className="text-center mt-1">
                                                    ${addCommas((item.qty * item.price).toFixed(2))}
                                                    <br />
                                                    ({addCommas(item.qty)}x{addCommas(item.price)})
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col >

                <Col md={10} lg={4}>
                    <Card className="mt-3">
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                                <h4>Checkout ({totalItems === 1 ? '1 item' : `${totalItems} items`})</h4>
                            </ListGroup.Item>
                            <ListGroup.Item className="fs-5">
                                <Row>
                                    <Col>Price:</Col>
                                    <Col>${addCommas(cart.itemsPrice)}</Col>
                                </Row>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${addCommas(cart.shippingPrice)}</Col>
                                </Row>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${addCommas(cart.taxPrice)}</Col>
                                </Row>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${addCommas(cart.totalPrice)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        <Button
                                            type="button"
                                            className="w-100"
                                            onClick={placeOrderHandler}
                                            disabled={cart.cartItems.length === 0}
                                        >
                                            {isLoading ? <Loader order /> : 'Place Order'}
                                        </Button>
                                    </Col>

                                    {error && (

                                        <div className="mt-3">
                                            <Message variant="danger" className="p-2">
                                                {error?.data?.message || error.error}
                                            </Message>
                                        </div>

                                    )}

                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row >
        </>
    )
}

export default PlaceOrderScreen