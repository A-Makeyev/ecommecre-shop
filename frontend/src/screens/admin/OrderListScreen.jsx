import { Link } from 'react-router-dom'
import { Row, Col, Table } from 'react-bootstrap'
import { FaTimes, FaCheck, FaExternalLinkAlt } from 'react-icons/fa'
import { useGetOrdersQuery } from '../../slices/ordersApiSlice'
import { adjustPrice, formatDateAndTime } from '../../utils/cartUtils'
import GoBackButton from '../../components/GoBackButton'
import Message from '../../components/Message'
import Loader from '../../components/Loader'


const OrderListScreen = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery()
    const emptyOrderList = JSON.stringify(orders) === '[]'

    return (
        <>
            <Row>
                <Col xs={4} sm={3} md={4} lg={2} xl={3}>
                    <GoBackButton text="Home" url="/" />
                </Col>
                <Col xs={5} sm={7} md={5} lg={8} xl={6} className="my-3 text-center">
                    <h1>{emptyOrderList ? '' : 'Orders'}</h1>
                </Col>
            </Row>

            {isLoading ? <Loader /> : error ? (
                <Message variant="danger" className="text-center">
                    {error?.data?.message || error.error}
                </Message>
            ) : emptyOrderList ? (
                <Col className="mt-5 fs-1 text-center">
                    <h3>No Recent Orders</h3>
                    <h1>¯\_(ツ)_/¯</h1>
                </Col>
            ) : (
                <Row>
                    <Table striped responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>TRANSACTION</th>
                                <th>USER</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user && order.user.name}</td>
                                    <td>{formatDateAndTime(order.createdAt)}</td>
                                    <td>{adjustPrice(order.totalPrice)}</td>
                                    <td>
                                        {order.isPaid ? (
                                            <FaCheck className="text-success fs-5" />
                                        ) : (
                                            <FaTimes className="text-danger fs-5" />
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            <FaCheck className="text-success fs-5" />
                                        ) : (
                                            <FaTimes className="text-danger fs-5" />
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/order/${order._id}`} target="_blank">
                                            <FaExternalLinkAlt role="button" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Row>
            )}

        </>
    )
}

export default OrderListScreen