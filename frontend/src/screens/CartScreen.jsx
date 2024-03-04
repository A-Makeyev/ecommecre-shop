import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaTrash } from 'react-icons/fa'
import { Container, Row, Col, ListGroup, Form, Button, Card, Image } from 'react-bootstrap'
import { addToCart, removeFromCart } from '../slices/cartSlice'
import GoBackButton from '../components/GoBackButton'
import Message from '../components/Message'


const CartScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    const totalItems = cartItems.reduce((accumulator, item) => accumulator + item.qty, 0)
    const totalPrice = cartItems.reduce((accumulator, item) => accumulator + item.qty * item.price, 0).toFixed(2)

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
            <Container>
                <Row>
                    <Col md={8}>
                        <Row>
                            <Col md={4}>
                                <GoBackButton />
                            </Col>
                            <Col className="mt-3">
                                <h1>
                                    {cartItems.length === 0 ? 'Your cart is empty' : 'Shopping Cart'}
                                </h1>
                            </Col>
                        </Row>

                        {cartItems.length === 0 ? (
                            <Message varient="none">
                                <div className="text-center mt-5">
                                    <h3>(◡ _ ◡)</h3>
                                </div>
                            </Message>
                        ) : (
                            <ListGroup variant="flush" className="mt-3 me-3">
                                {cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="d-flex justify-content-start mt-3 mb-2">
                                            <Col md={3} lg={2} className="mb-3">
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col xs={13} sm={10} md={7} lg={5}>
                                                <Link to={`/product/${item._id}`}>
                                                    <h5>{item.name}</h5>
                                                </Link>
                                            </Col>
                                            <Col xs={3} sm={3} md={3} lg={2} className="mt-1 text-center">
                                                <h5>${item.price}</h5>
                                            </Col>
                                            <Col xs={2} sm={3} lg={2}>
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
                                                    className="p-1 text-center"
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
                    <Col md={4} className="mt-4">
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal Items ({totalItems})
                                    </h3>
                                    <h3>
                                        ${totalPrice}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button
                                        type="button"
                                        className="btn-block"
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