import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Rating from '../components/Rating'
import { FaArrowLeft } from 'react-icons/fa'
import { useGetProductDetailsQuery } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
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

    const { id: productId } = useParams()
    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId)

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
                                            <Col>
                                                Price:
                                            </Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Status:
                                            </Col>
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
                                    <ListGroup.Item>
                                        <Button type="button" className="w-100 btn-block" disabled={product.countInStock === 0}>
                                            Add To Cart
                                        </Button>
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