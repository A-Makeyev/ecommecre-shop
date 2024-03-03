import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaTrash, FaArrowLeft } from 'react-icons/fa'
import { Row, Col, ListGroup, Form, Button, Card, Image } from 'react-bootstrap'
import { addToCart, removeFromCart } from '../slices/cartSlice'
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
        <Row>
            <Col md={8}>
                <h1 style={{ marginButton: "20px" }}>Cart</h1>
                <Link to="/" className='btn btn-light my-3'>
                    <FaArrowLeft className='mb-1' />
                    {' '}
                    <span>Go Back</span>
                </Link>

                {cartItems.length === 0 ? (
                    <Message varient="none">
                        <h3 >Your cart is empty</h3>
                    </Message>
                ) : (
                    <ListGroup variant="flush">
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item._id}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item._id}`}>
                                            {item.name}
                                        </Link>
                                    </Col>
                                    <Col md={2}>${item.price}</Col>
                                    <Col md={2}>
                                        <Form.Control
                                            as="select"
                                            role="button"
                                            value={item.qty}
                                            onChange={(event) => addToCartHandler(item, Number(event.target.value))}
                                        >
                                            {[...Array(item.countInStock).keys()].map((i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={1}>
                                        <Button 
                                            type="button" 
                                            variant="light" 
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
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>
                                Subtotal Items ({ totalItems }) 
                            </h2>
                            <h2>
                                ${totalPrice}
                            </h2>
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
    )
}

export default CartScreen