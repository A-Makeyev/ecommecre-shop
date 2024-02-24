import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import Rating from "./Rating"


const product = ({ product }) => {
    return (
        <Card className="my-3 p-3 rounded">
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
                    ${product.price}
                </Card.Text>
                <Card.Text as="h5">
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default product