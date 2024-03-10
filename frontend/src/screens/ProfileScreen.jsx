import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Row, Col, Form, Button, Table } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice'
import { useProfileMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { addCommas, formatDateAndTime } from '../utils/cartUtils'
import { FaTimes, FaCheck, FaExternalLinkAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import GoBackButton from '../components/GoBackButton'
import Message from '../components/Message'
import Loader from '../components/Loader'


const ProfileScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation()
    const { data: orders, isLoading, error } = useGetMyOrdersQuery()
    const { userInfo } = useSelector(state => state.auth)

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name)
            setEmail(userInfo.email)
        }
    }, [userInfo])

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

    return (
        <>
            <Row>
                <Col md={3}>
                    <h2>Profile</h2>
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

                        <Button type="submit" variant="primary" className="mt-2">
                            {loadingUpdateProfile ? <Loader update /> : 'Update'}
                        </Button>
                    </Form>
                </Col>
                <Col md={9}>
                    <h2>Orders</h2>
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="danger">
                            {error?.data?.message || error.error}
                        </Message>
                    ) : (
                        <Table striped responsive className="table-sm">
                            <thead>
                                <tr>
                                    <th>TRANSACTION ID</th>
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
                                        <td>${addCommas(order.totalPrice)}</td>
                                        <td>
                                            {order.isPaid ? (
                                                // <>
                                                //     <span>{formatDateAndTime(order.paidAt)} </span>
                                                //     <FaCheck className="text-success mb-1" />
                                                // </>
                                                <FaCheck className="text-success fs-5" />
                                            ) : (
                                                <FaTimes className="text-danger fs-5" />
                                            )}
                                        </td>
                                        <td>
                                            {order.isDelievered ? (
                                                // <>
                                                //     <span>{formatDateAndTime(order.isDelievered)} </span>
                                                //     <FaCheck className="text-success mb-1" />
                                                // </>
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
            </Row>
        </>
    )
}

export default ProfileScreen