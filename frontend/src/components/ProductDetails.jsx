import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Row, Col, Card, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useGetProductDetailsQuery } from '../slices/productsApiSlice'
import { addToCart } from '../slices/cartSlice'
import { FaCartPlus } from 'react-icons/fa'
import { alertText, quantityAlert, addedToCartMessage, addCommas } from '../utils/cartUtils'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Rating from '../components/Rating'


const ProductDetails = ({ product }) => {
    const dispatch = useDispatch()
    const [qty, setQty] = useState(1)
    const { data: productDetails, isLoading, error } = useGetProductDetailsQuery(product._id)


    const addToCartHandler = () => {
        setQty(Number(qty))
        dispatch(addToCart({ ...productDetails, qty }))
        addedToCartMessage(qty, product.name)
    }

    return (
        <Card className="my-1 p-2 h-100 rounded">
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message varient="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <Link to={`/product/${product._id}`} >
                        <Card.Img src={product.image} variant="top" />
                    </Link>
                    <Card.Body>
                        <Link to={`/product/${product._id}`}>
                            <Card.Title as="div" className="product-title">
                                <h5>{product.name}</h5>
                            </Card.Title>
                        </Link>
                        <Card.Text as="h4">
                            <Row>
                                <Col
                                    xs={3} sm={3} md={4} lg={5} xl={6}
                                    className={quantityAlert(product.countInStock)}
                                    value={alertText(product.countInStock)}
                                >
                                    ${addCommas(product.price)}
                                </Col>

                                {product.countInStock > 0 ? (
                                    <>
                                        <Col xs={1} sm={1} md={1} lg={1} xl={1} className="ms-cart-margin-1">
                                            <span id={`add-${product.name.split(' ', 3).join('-')}`}>
                                                <FaCartPlus role="button" className="fs-5" onClick={addToCartHandler} />
                                            </span>
                                        </Col>
                                        <Col xs={1} sm={1} md={1} lg={1} xl={2} className="ms-cart-margin-1">
                                            <Form.Control
                                                as="select"
                                                value={qty}
                                                className="qty-select"
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
                                    </>
                                ) : (
                                    <Col className="qty-select-invisible"></Col>
                                )}
                            </Row>
                        </Card.Text>
                        <Card.Text as="h5" className="mt-4">
                            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                        </Card.Text>
                    </Card.Body>
                </>
            )}
        </Card >
    )
}

export default ProductDetails