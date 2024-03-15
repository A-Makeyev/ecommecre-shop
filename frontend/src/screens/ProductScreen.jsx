import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import { useGetProductDetailsQuery } from '../slices/productsApiSlice'
import { addedToCartMessage, adjustPrice } from '../utils/cartUtils'
import { addToCart } from '../slices/cartSlice'
import GoBackButton from '../components/GoBackButton'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Rating from '../components/Rating'
// import { useEffect, useState } from 'react'
// import axios from 'axios'


const ProductScreen = () => {
    // const [ product, setProduct ] = useState([])
    // useEffect(() => {
    //     const fetchProduct = async () => {
    //         const { data } = await axios.get(`/api/products/${productId}`)
    //         setProduct(data)
    //     }
    //     fetchProduct()
    // }, [productId])

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [qty, setQty] = useState(1)
    const { id: productId } = useParams()
    const cart = useSelector(state => state.cart)
    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId)

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }))
        addedToCartMessage(qty, product.name)
    }

    const buyNowHandler = () => {
        dispatch(addToCart({ ...product, qty }))

        const emptyShippingAddress = Object.keys(cart.shippingAddress).length === 0
        const emptyPaymentMethod = Object.keys(cart.paymentMethod).length === 0

        if (!emptyShippingAddress && emptyPaymentMethod) {
            navigate('/login?redirect=/payment')
        } else if (!emptyShippingAddress && !emptyPaymentMethod) {
            navigate('/login?redirect=/placeorder')
        } else {
            navigate('/login?redirect=/shipping')
        }
    }

    return (
        <>
            <GoBackButton text="Home" url="/" />

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger" className="text-center">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <Row>
                        <Col md={11} lg={13} xl={4} className="mt-4 mb-3 text-center">
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={6} lg={7} xl={5}>
                            <ListGroup>
                                <ListGroup.Item variant="flush" className="border-0">
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <hr align="center" className="border-bottom border-1" />
                                <ListGroup.Item variant="flush" className="border-0">
                                    <p>{product.description}</p>
                                </ListGroup.Item>
                                <hr align="center" className="border-bottom border-1" />
                                <ListGroup.Item variant="flush" className="border-0">
                                    <Rating value={product.rating} text={product.numReviews === 1 ? '1 review' : `${product.numReviews} reviews`} />
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={5} lg={13} xl={3}>
                            <Card className="mt-3">
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>{adjustPrice(product.price)}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                <strong>

                                                    {
                                                        ((product.countInStock < 10) && (product.countInStock > 1))
                                                            ? <span className="text-danger">Only {product.countInStock} Left</span>
                                                            : product.countInStock === 1 ? <span className="text-danger">Last One</span>
                                                                : product.countInStock > 0 ? <span className="text-success">In Stock</span>
                                                                    : <span className="text-danger">Out of Stock</span>
                                                    }

                                                </strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col className="mt-2">Quantity:</Col>
                                                <Col>
                                                    <Form.Control
                                                        as="select"
                                                        value={qty}
                                                        className="w-50 text-center"
                                                        disabled={product.countInStock === 1}
                                                        role={product.countInStock > 1 && "button"}
                                                        onChange={(event) => setQty(Number(event.target.value))}
                                                    >
                                                        {[...Array(product.countInStock).keys()].map((item) => (
                                                            <option key={item + 1} value={item + 1}>
                                                                {item + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <Row>
                                            <Col className="text-center">
                                                <Button
                                                    type="button"
                                                    className="w-100 m-1"
                                                    disabled={product.countInStock === 0}
                                                    onClick={addToCartHandler}
                                                >
                                                    Add To Cart
                                                </Button>
                                                <Button
                                                    type="button"
                                                    className="w-100 m-1"
                                                    disabled={product.countInStock === 0}
                                                    onClick={buyNowHandler}
                                                >
                                                    Buy Now
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row >
                </>
            )}
        </>
    )
}

export default ProductScreen