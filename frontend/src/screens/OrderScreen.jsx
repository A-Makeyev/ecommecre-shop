import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Button, Card, ListGroup, Image } from 'react-bootstrap'
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery } from '../slices/ordersApiSlice'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { addCommas, formatDateAndTime } from '../utils/cartUtils'
import { toast } from 'react-toastify'
import GoBackButton from '../components/GoBackButton'
import Message from '../components/Message'
import Loader from '../components/Loader'

const OrderScreen = () => {
    const { id: orderId } = useParams()
    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId)
    const { data: paypal, isLoading: loadingPayPal, error: payPalError } = useGetPayPalClientIdQuery()
    const [payOrder, { isLoading: loadingPayment }] = usePayOrderMutation()
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

    useEffect(() => {
        if (!loadingPayPal && !payPalError && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD'
                    }
                })
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript()
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, payPalError])

    async function onApproveTest() {
        await payOrder({ orderId, details: { payer: {} } })
        refetch()
        toast.success('Payment Successful')
    }

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({ orderId, details })
                refetch()
                toast.success('Payment Successful')
            } catch (error) {
                toast.error(error?.data?.message || error.message)
            }
        })
    }

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice
                    }
                }
            ]
        }).then(function (orderId) {
            return orderId
        })
    }

    function onError(error) {
        toast.error(error.message)
    }

    return (
        <>
            <Row>
                <Col md={3} lg={2}>
                    <GoBackButton url="/profile" />
                </Col>
                <Col md={12} lg={8} className="text-center mt-3">
                    <h3>Order ID: {orderId}</h3>
                </Col>
            </Row>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <Row className="justify-content-center mt-4">
                        <Col md={9} lg={5}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>Shipping</h2>
                                    <p>
                                        <strong>Name: </strong>
                                        {order.user.name}
                                    </p>
                                    <p>
                                        <strong>Email: </strong>
                                        {order.user.email}
                                    </p>
                                    <p>
                                        <strong>Address: </strong>
                                        {' '} {order.shippingAddress.address}, {order.shippingAddress.city},
                                        {' '} {order.shippingAddress.country}, {order.shippingAddress.postalCode}
                                    </p>

                                    {order.isDelivered ? (
                                        <Message variant="success">
                                            <strong>
                                                Delievered At: {' '}
                                                {formatDateAndTime(order.deliveredAt, true)}
                                            </strong>
                                        </Message>
                                    ) : (
                                        <Message variant="info" className="text-center">
                                            <strong>Awaiting Dispatch</strong>
                                        </Message>
                                    )}

                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2>Payment</h2>
                                    <p>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>

                                    {order.isPaid ? (
                                        <Message variant="success" className="text-center">
                                            <strong>
                                                Paid At: {' '}
                                                {formatDateAndTime(order.paidAt, true)}
                                            </strong>
                                        </Message>
                                    ) : (
                                        <Message variant="info" className="text-center">
                                            <strong>Awaiting Payment</strong>
                                        </Message>
                                    )}

                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={9} lg={4}>
                            <Card className="mt-3 mb-3">
                                <ListGroup variant="flush" className="fs-5">
                                    <ListGroup.Item>
                                        <h2>Order Summary</h2>
                                        <h4>Total ({order.orderItems.length === 1 ? '1 item' : `${order.orderItems.length} items`})</h4>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>${addCommas(order.itemsPrice)}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Shipping:</Col>
                                            <Col>${addCommas(order.shippingPrice)}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Tax:</Col>
                                            <Col>${addCommas(order.taxPrice)}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>${addCommas(order.totalPrice)}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {!order.isPaid ? (
                                        <ListGroup.Item className="p-3 mt-1">
                                            {isPending ? <Loader /> : (
                                                <div>

                                                    {process.env.NODE_ENV === 'development' &&
                                                        <Button onClick={onApproveTest} className="mb-2 w-100">
                                                            {loadingPayment || loadingPayment ? <Loader order /> : 'PayTest'}
                                                        </Button>
                                                    }

                                                    <PayPalButtons
                                                        createOrder={createOrder}
                                                        onApprove={onApprove}
                                                        onError={onError}
                                                    >
                                                    </PayPalButtons>
                                                </div>
                                            )}

                                        </ListGroup.Item>
                                    ) : (
                                        <ListGroup.Item className="p-3 mt-1">
                                            <Button className="mb-2 w-100">
                                                Download Invoice
                                            </Button>
                                            <Button className="w-100 mb-1">
                                                Send Invoice to Your Email
                                            </Button>
                                        </ListGroup.Item>
                                    )}

                                </ListGroup>
                            </Card>
                        </Col>
                        <Col md={13} lg={9}>
                            <ListGroup.Item>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index} className="border rounded p-3 mb-2">
                                        <Row className="ms-text-center">
                                            <Col md={2} lg={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col md={7} lg={6}>
                                                <Link to={`/product/${item._id}`}>
                                                    <strong>{item.name}</strong>
                                                </Link>
                                            </Col>
                                            <Col md={1} lg={5} className="text-center">
                                                ${addCommas((item.qty * item.price).toFixed(2))}
                                                <br />
                                                ({addCommas(item.qty)}x{addCommas(item.price)})
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup.Item>
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
}

export default OrderScreen