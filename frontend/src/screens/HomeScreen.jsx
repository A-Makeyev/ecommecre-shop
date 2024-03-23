import { Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import ProductDetails from '../components/ProductDetails'
import GoBackButton from '../components/GoBackButton'
import ProductCarousel from '../components/ProductCarousel'
import Paginate from '../components/Paginate'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
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

    const { keyword, pageNumber } = useParams()
    const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber })
    //const products = data.products.map((p) => p.products)
    
    return (
        <>
            {keyword ? (
                <Row>
                    <Col xs={4} sm={3} md={4} lg={2} xl={3}>
                        <GoBackButton text="Home" url="/" />
                    </Col>
                    <Col xs={5} sm={7} md={5} lg={8} xl={6} className="text-center">
                        <h1 className="text-center mt-3 mb-5">Latest Products</h1>
                    </Col>
                </Row>
            ) : !keyword ? (
                <>
                    <ProductCarousel />
                    <h1 className="text-center mt-3 mb-5">Latest Products</h1>
                </>
            ) : (
                <h1 className="text-center mt-3 mb-5">Latest Products</h1>
            )}

            <Row className="sm-justify-content-center">

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger" className="text-center">
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <>
                        <Meta 
                            description={JSON.stringify(data.products.map((p) => p.category + ' ' + p.brand + ' ' + p.name + ' ').toString())} 
                            keywords={JSON.stringify(data.products.map((p) => p.category + ' ' + p.brand + ' ' + p.name + ' ').toString())} 
                        /> 

                        {data.products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="p-2">
                                <ProductDetails product={product} />
                            </Col>
                        ))}

                        <Row className="mt-5">
                            <Col className="d-flex justify-content-center">
                                <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
                            </Col>
                        </Row>
                    </>
                )}
            </Row>
        </>
    )
}

export default HomeScreen