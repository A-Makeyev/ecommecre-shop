import { Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import ProductDetails from '../components/ProductDetails'
import Paginate from '../components/Paginate'
import Message from '../components/Message'
import Loader from '../components/Loader'
// import { useEffect, useState } from 'react'
// import axios from 'axios'


const HomeScreen = () => {
    // const [products, setProducts] = useState([])
    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         const { data } = await axios.get('/api/products')
    //         setProducts(data)
    //     }
    //     fetchProducts()
    // }, [])

    const { pageNumber } = useParams()
    const { data, isLoading, error } = useGetProductsQuery({ pageNumber })

    return (
        <>
            <h1 className="text-center mb-5">Latest Products</h1>
            <Row className="sm-justify-content-center">

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger" className="text-center">
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <>
                        {data.products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="p-2">
                                <ProductDetails product={product} />
                            </Col>
                        ))}

                        <Row className="mt-5">
                            <Col className="d-flex justify-content-center">
                                <Paginate pages={data.pages} page={data.page} />
                            </Col>
                        </Row>
                    </>
                )}
            </Row>
        </>
    )
}

export default HomeScreen