import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice'
import { addedToCartMessage, adjustPrice, timeSince } from '../utils/cartUtils'
import { addToCart } from '../slices/cartSlice'
import { toast } from 'react-toastify'
import GoBackButton from '../components/GoBackButton'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Rating from '../components/Rating'
import Meta from '../components/Meta'
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
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const { id: productId } = useParams()
    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId)
    const [createReview, { isLoading: creatingReview }] = useCreateReviewMutation(productId)
    const { userInfo } = useSelector(state => state.auth)
    const cart = useSelector(state => state.cart)

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

    const submitHandler = async (event) => {
        event.preventDefault()

        try {
            await createReview({
                productId,
                rating,
                comment
            }).unwrap()
            refetch()
            setRating(0)
            setComment('')
            toast.success(
                'Added Review',
                { theme: "colored", hideProgressBar: true }
            )
        } catch (error) {
            toast.info(
                error?.data?.message || error.error,
                { theme: "colored", hideProgressBar: true }
            )
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
                    <Meta 
                        title={`Shop | ${product.name.split(' ', 3).join(' ')}`} 
                        description={product.category + ' ' + product.brand + ' ' + product.name + ' '} 
                        keywords={product.category + ' ' + product.brand + ' ' + product.name + ' '} 
                    />
                    <Row>
                        <Col lg={13} xl={4} className="mt-4 mb-3 text-center">
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={7} xl={5}>
                            <ListGroup>
                                <ListGroup.Item variant="flush" className="border-0">
                                    <h3>{product.name}</h3>

                                    {product.reviews.length === 0 ? (
                                        <p>No reviews yet</p>
                                    ) : (
                                        <Rating value={product.rating} />
                                    )}

                                </ListGroup.Item>
                                <ListGroup.Item variant="flush" className="border-0">
                                    <p>{product.description}</p>
                                </ListGroup.Item>

                                <ListGroup.Item className="border-0">
                                    <hr />

                                    {product.reviews.length > 0 &&
                                        <h5>Reviews ({product.reviews.length})</h5>
                                    }

                                    {product.reviews.map((review) => (
                                        <ListGroup.Item key={review._id} className="border-0 p-0 mt-3">
                                            <strong>{review.name}</strong>
                                            <Rating value={review.rating} />
                                            <p className="fw-lighter">{timeSince(review.createdAt)}</p>
                                            <p>{review.comment}</p>
                                            <hr />
                                        </ListGroup.Item>
                                    ))}

                                    {userInfo ? (
                                        <>
                                            <Form onSubmit={submitHandler}>
                                                <Row>
                                                    <Form.Group controlId="comment" className="my-2">
                                                        <Form.Label>Write a Review</Form.Label>
                                                        <Form.Control
                                                            rows={5}
                                                            as="textarea"
                                                            value={comment}
                                                            onChange={(event) => setComment(event.target.value)}
                                                        >
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col md={6}>
                                                        <Form.Group controlId="rating">
                                                            <Form.Control
                                                                required
                                                                as="select"
                                                                role="button"
                                                                value={rating}
                                                                className="text-center"
                                                                onChange={(event) => setRating(Number(event.target.value))}
                                                            >
                                                                <option value="">Choose Rating</option>
                                                                <option value="1">1 - Bad</option>
                                                                <option value="2">2 - Poor</option>
                                                                <option value="3">3 - Good</option>
                                                                <option value="4">4 - Excellent</option>
                                                                <option value="5">5 - Outstanding</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Button type="submit" className="w-100" disabled={creatingReview}>
                                                            {creatingReview ? <Loader update /> : 'Submit'}
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </>
                                    ) : (
                                        <p>
                                            <Link to="/login">Sign in</Link> to write a review
                                        </p>
                                    )}

                                </ListGroup.Item>

                            </ListGroup>
                        </Col>
                        <Col md={5} lg={13} xl={3}>
                            <Card className="mt-3 sticky-top sticky-card">
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
                                                        role={product.countInStock > 1 ? "button" : undefined}
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