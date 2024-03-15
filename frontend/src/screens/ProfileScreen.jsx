import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Row, Col, Card, Form, Button, Table } from 'react-bootstrap'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice'
import { useProfileMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { adjustPrice, formatDateAndTime } from '../utils/cartUtils'
import { FaTimes, FaCheck, FaExternalLinkAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import GoBackButton from '../components/GoBackButton'
import Message from '../components/Message'
import Loader from '../components/Loader'


const ProfileScreen = () => {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation()
    const { data: orders, isLoading, error } = useGetMyOrdersQuery()
    const { userInfo } = useSelector(state => state.auth)
    const emptyOrdersList = JSON.stringify(orders) === '[]'

    const submitHandler = async (event) => {
        event.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Passwords don\'t match!')
        } else {
            try {
                const response = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap()
                dispatch(setCredentials(response))
                toast.success('Updated Profile')
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name)
            setEmail(userInfo.email)
        }
    }, [userInfo])

    return (
        <>
            <GoBackButton text="Home" url="/" />
            <Row className="justify-content-center">
                <Col md={9} lg={emptyOrdersList ? 5 : 4}>
                    <Card className="my-4 p-3">
                        <h3>Personal Details</h3>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId="name" className="my-2">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="name"
                                    value={name}
                                    className="fs-5"
                                    onChange={(event) => setName(event.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="email" className="my-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    className="fs-5"
                                    onChange={(event) => setEmail(event.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="password" className="my-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    className="fs-5"
                                    onChange={(event) => setPassword(event.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="confirmPassword" className="my-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    className="fs-5"
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Button type="submit" variant="primary" className="mb-2 w-100">
                                {loadingUpdateProfile ? <Loader update /> : 'Update'}
                            </Button>
                        </Form>
                    </Card>
                </Col>
                {emptyOrdersList ? (
                    <Col md={13} lg={4} className="mt-5 fs-1 text-center">
                        <h3>No Recent Orders</h3>
                        <h1>¯\_(ツ)_/¯</h1>
                    </Col>
                ) : (
                    <Col md={13} lg={8} className="mt-2 text-center">
                        <h3>Recent Orders</h3>
                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <Message variant="danger" className="text-center">
                                {error?.data?.message || error.error}
                            </Message>
                        ) : (
                            <Table striped responsive className="table-sm mt-2">
                                <thead>
                                    <tr>
                                        <th>TRANSACTION</th>
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
                                                <LinkContainer to={`/order/${order._id}`}>
                                                    <FaExternalLinkAlt role="button" />
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Col>
                )}
            </Row >
        </>
    )
}

export default ProfileScreen