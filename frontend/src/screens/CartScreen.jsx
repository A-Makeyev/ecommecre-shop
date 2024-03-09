import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaTrash } from 'react-icons/fa'
import { Container, Row, Col, ListGroup, Form, Button, Card, Image } from 'react-bootstrap'
import { addToCart, removeFromCart } from '../slices/cartSlice'
import { addCommas } from '../utils/cartUtils'
import GoBackButton from '../components/GoBackButton'
import Message from '../components/Message'


const CartScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    const totalItems = cartItems.reduce((accumulator, item) => accumulator + item.qty, 0)
    const totalPrice = addCommas(cartItems.reduce((accumulator, item) => accumulator + item.qty * item.price, 0).toFixed(2))

    const addToCartHandler = async (product, qty) => {
        dispatch(addToCart({ ...product, qty }))
    }

    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id)) // id -> action payload
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping')
    }

    return (
        <>
            <Row>
                <Col sm={3} md={3} lg={2}>
                    <GoBackButton url="/" />
                </Col>
                <Col sm={13} md={6} lg={6} xl={6} className="text-center mt-3">
                    <h1>{cartItems.length === 0 ? 'Your cart is empty' : 'Shopping Cart'}</h1>
                </Col>
            </Row>
            <Container>
                <Row>
                    <Col md={8} lg={9}>
                        {cartItems.length === 0 ? (
                            <Message variant="none" className="text-center mt-5">
                                <h1>(◡ _ ◡)</h1>
                            </Message>
                        ) : (
                            <ListGroup variant="flush" className="mt-3 me-3">
                                {cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="mt-3 mb-2 justify-content-center">
                                            <Col md={3} lg={2} className="mb-3">
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col xs={13} sm={11} md={7} lg={5} className="ms-text-center mb-3 pl-5">
                                                <Link to={`/product/${item._id}`}>
                                                    <h5>{item.name}</h5>
                                                </Link>
                                            </Col>
                                            <Col xs={4} sm={3} md={3} lg={2} className="mt-1 p-0 text-center">
                                                <h5>${addCommas(item.price)}</h5>
                                            </Col>
                                            <Col xs={4} sm={3} lg={2}>
                                                <Form.Control
                                                    as="select"
                                                    value={item.qty}
                                                    className="p-1 text-center"
                                                    disabled={item.countInStock === 1}
                                                    role={item.countInStock > 1 && "button"}
                                                    onChange={(event) => addToCartHandler(item, Number(event.target.value))}
                                                >
                                                    {[...Array(item.countInStock).keys()].map((i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                            <Col xs={1} sm={3} md={1}>
                                                <Button
                                                    type="button"
                                                    variant="light"
                                                    className="p-1"
                                                    onClick={() => removeFromCartHandler(item._id)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}

                    </Col>
                    <Col md={4} lg={3} className="mt-4">
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h4>Subtotal ({totalItems} Items)</h4>
                                    <h4>${totalPrice}</h4>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button
                                        type="button"
                                        className="p-2 w-100"
                                        disabled={cartItems.length === 0}
                                        onClick={checkoutHandler}
                                    >
                                        Proceed To Checkout
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default CartScreen