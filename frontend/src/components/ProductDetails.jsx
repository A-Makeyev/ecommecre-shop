import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Row, Col, Card, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useGetProductDetailsQuery } from '../slices/productsApiSlice'
import { addToCart } from '../slices/cartSlice'
import { FaCartPlus } from 'react-icons/fa'
import { addedToCartToastOptions } from '../utils/cartUtils'
import { toast } from 'react-toastify'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Rating from '../components/Rating'


const ProductDetails = ({ product }) => {
    const [qty, setQty] = useState(1)
    const { data: productDetails, isLoading, error } = useGetProductDetailsQuery(product._id)

    const dispatch = useDispatch()
    const addToCartHandler = () => {
        setQty(Number(qty))
        dispatch(addToCart({ ...productDetails, qty }))
        toast.success(
            `${qty > 1 ? `${qty} ${product.name}s were` : `${qty} ${product.name} was`} added to your cart`,
            addedToCartToastOptions
        )
    }

    return (
        <Card className="my-3 p-3 rounded">
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message varient="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <Link to={`/product/${product._id}`}>
                        <Card.Img src={product.image} variant="top" />
                    </Link>
                    <Card.Body>
                        <Link to={`/product/${product._id}`}>
                            <Card.Title as="div" className="product-title">
                                <h3>{product.name}</h3>
                            </Card.Title>
                        </Link>
                        <Card.Text as="h4">
                            <Row>
                                <Col
                                    xs={3} sm={3} md={6} lg={6} xl={7}
                                    className={product.countInStock < 1 ? "out-of-stock mt-1 xs-price-width-120" : "mt-1 xs-price-width-120"}
                                >
                                    ${product.price}
                                </Col>

                                {product.countInStock > 0 && (
                                    <>
                                        <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                                            <FaCartPlus role="button" className="mt-1" onClick={addToCartHandler} />
                                        </Col>
                                        <Col xs={1} sm={1} md={1} lg={1} xl={2}>
                                            <Form.Control
                                                as="select"
                                                value={qty}
                                                role="button"
                                                className="qty-select"
                                                onChange={(event) => setQty(Number(event.target.value))}
                                            >
                                                {[...Array(product.countInStock).keys()].map((item) => (
                                                    <option key={item + 1} value={item + 1}>
                                                        {item + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </>
                                )}
                            </Row>
                        </Card.Text>
                        <Card.Text as="h5">
                            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                        </Card.Text>
                    </Card.Body>
                </>
            )}
        </Card>
    )
}

export default ProductDetails