import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useGetTopProductsQuery } from '../slices/productsApiSlice'
import { adjustPrice } from '../utils/cartUtils'
import Message from '../components/Message'
import Loader from '../components/Loader'


const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetTopProductsQuery()

    return (
        <>
            {isLoading ? <Loader /> : error ? (
                <Message variant="danger" className="text-center">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <Carousel pause="hover" data-bs-theme="dark" variant="dark" className="text-center mb-5">
                    {products.map((product) => (
                        <Carousel.Item key={product._id}>
                            <Link to={`/product/${product._id}`}>
                                <Image src={product.image} alt={product.name} className="carousel-image" />
                                <Carousel.Caption className="carousel-caption">
                                    <h3>{product.name} ({adjustPrice(product.price)})</h3>
                                </Carousel.Caption>
                            </Link>
                        </Carousel.Item>
                    ))}
                </Carousel>
            )}
        </>
    )
}

export default ProductCarousel