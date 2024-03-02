import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Rating from '../components/Rating'
import { FaArrowLeft } from 'react-icons/fa'
import { useGetProductDetailsQuery } from '../slices/productsApiSlice'
import { addToCart } from '../slices/cartSlice'
import Message from '../components/Message'
import Loader from '../components/Loader'
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

    const [ qty, setQty ] = useState(1)
    const { id: productId } = useParams()
    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }))
    }
    const buyNowHandler = () => {
        dispatch(addToCart({ ...product, qty }))
        navigate('/cart')
    }

    return (
        <>
            <Link to="/" className='btn btn-light my-3'>
                <FaArrowLeft className='mb-1' />
                {' '}
                <span>Go Back</span>
            </Link>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message varient="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <Row>
                        <Col md={5}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={4}>
                            <ListGroup >
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
                        <Col md={3}>
                            <Card>
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
                                                    {product.countInStock > 0
                                                        ? <span className="text-success">In Stock</span>
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
                                                        role="button"
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
                                            <Col className="pe-0">
                                                <Button 
                                                    type="button" 
                                                    className="w-100 btn-block" 
                                                    disabled={product.countInStock === 0}
                                                    onClick={addToCartHandler}
                                                >
                                                    Add To Cart
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button 
                                                    type="button" 
                                                    className="w-100 btn-block" 
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