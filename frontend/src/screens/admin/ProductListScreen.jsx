import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, Button, Table } from 'react-bootstrap'
import { useGetProductsQuery, useCreateProductMutation } from '../../slices/productsApiSlice'
import { adjustPrice } from '../../utils/cartUtils'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import GoBackButton from '../../components/GoBackButton'
import Message from '../../components/Message'
import Loader from '../../components/Loader'


const ProductListScreen = () => {
    const navigate = useNavigate()
    const { data: products, isLoading, error, refetch } = useGetProductsQuery()
    const [createProduct, { isLoading: creatingProduct }] = useCreateProductMutation()
    const emptyProductsList = JSON.stringify(products) === '[]'

    const deleteProductHandler = (id) => {

    }

    const createProductHandler = async () => {
        try {
            const newProduct = await createProduct()
            navigate(`/admin/product/${newProduct.data._id}/edit`)
            refetch()
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }

    return (
        <>
            <Row>
                <Col xs={4} sm={3} md={3} lg={3} xl={4}>
                    <GoBackButton text="Home" url="/" />
                </Col>
                <Col xs={5} sm={7} md={6} lg={6} xl={4} className="my-3 text-center">
                    <h1>{emptyProductsList ? '' : 'Products'}</h1>
                </Col>
                <Col sm={13} md={3} lg={3} xl={4} className="text-end">
                    <Button role="button" className="mt-3 text-center sm-width-100" onClick={createProductHandler}>
                        {creatingProduct ? <Loader create /> : (
                            <>
                                <FaEdit className="mb-1" />
                                {' '} Create Product
                            </>
                        )}
                    </Button>
                </Col>
            </Row>

            {isLoading ? <Loader /> : error ? (
                <Message variant="danger" className="text-center">
                    {error?.data?.message || error.error}
                </Message>
            ) : emptyProductsList ? (
                <Col className="mt-5 fs-1 text-center">
                    <h3>No Products Available</h3>
                    <h1>¯\_(ツ)_/¯</h1>
                </Col>
            ) : (
                <>
                    <Table striped bordered responsive className="table-sm mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{adjustPrice(product.price, '$')}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <Link to={`/admin/product/${product._id}/edit`}>
                                            <FaEdit role="button" className="fs-5 m-1" />
                                        </Link>
                                    </td>
                                    <td>
                                        <FaTrash
                                            role="button"
                                            className="fs-5 m-1 delete-product"
                                            onClick={() => deleteProductHandler(product._id)}
                                        />
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </Table>
                </>
            )}
        </>
    )
}

export default ProductListScreen