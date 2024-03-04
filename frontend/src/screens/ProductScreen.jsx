import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetProductDetailsQuery } from '../slices/productsApiSlice'
import { addToCart } from '../slices/cartSlice'
import { addedToCartToastOptions, getRandomEmoji } from '../utils/cartUtils'
import { toast } from 'react-toastify'
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
    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId)

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }))
        toast.success(
            `${qty > 1 
            ? `${qty} ${product.name.split(' ', 3).join(' ')}s are`
            : `${qty} ${product.name.split(' ', 3).join(' ')} is`} waiting for you in the cart ${getRandomEmoji()}`,
                addedToCartToastOptions
        )
    }
    
    const buyNowHandler = () => {
        dispatch(addToCart({ ...product, qty }))
        navigate('/cart')
    }

    return (
        <>
            <GoBackButton />

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message varient="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <Row>
                        <Col md={12} lg={4} className="mt-4">
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={6} lg={5}>
                            <ListGroup className="text-center">
                                <ListGroup.Item variant="flush" className="border-0">
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <hr align="center" className="border-bottom border-1 border-dark" />
                                <ListGroup.Item variant="flush" className="border-0">
                                    <p>{product.description}</p>
                                </ListGroup.Item>
                                <hr align="center" className="border-bottom border-1 border-dark" />
                                <ListGroup.Item variant="flush" className="border-0">
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={5} lg={3}>
                            <Card className="mt-3">
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                <strong>

                                                    {
                                                        ((product.countInStock < 10) && (product.countInStock > 1)) ? <span className="text-danger">Only {product.countInStock} Left</span>
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