import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useLoginMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'
import FormContainer from '../components/FormContainer'
import GoBackButton from '../components/GoBackButton'
import Loader from '../components/Loader'


const LoginScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [login, { isLoading }] = useLoginMutation()
    const { userInfo } = useSelector(state => state.auth)
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const redirect = searchParams.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    const submitHandler = async (event) => {
        event.preventDefault()
        const time = new Date().getHours()
        const greeting = 'Good ' + (time < 12 ? 'morning' : time < 18 ? 'afternoon' : 'evening')

        try {
            const response = await login({ email, password }).unwrap()
            dispatch(setCredentials({ ...response }))
            navigate(redirect)
            toast(`${greeting} ${response.name.split(' ')[1]}`)
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }

    return (
        <>
            <GoBackButton url="/" />
            <FormContainer>
                <h1 className="text-center">Sign In</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="email" className="my-3 ">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="password" className="my-3 ">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
                        {isLoading ? <Loader signIn /> : 'Sign In'}
                    </Button>
                </Form>
                <Row className="py-3">
                    <Col>
                        No account yet? {' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                            Sign up
                        </Link>
                    </Col>
                </Row>
            </FormContainer>
        </>
    )
}

export default LoginScreen