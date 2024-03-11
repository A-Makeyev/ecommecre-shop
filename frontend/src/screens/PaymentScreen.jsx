import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Button } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import GoBackButton from '../components/GoBackButton'
import { savePaymentMethod } from '../slices/cartSlice'


const PaymentScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart
    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping')
        }
    }, [shippingAddress, navigate])

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return (
        <>
            <Row>
                <Col md={3} lg={2} xl={2}>
                    <GoBackButton url="/shipping" />
                </Col>
                <Col sm={13} md={7} lg={8} xl={8} className="mt-3">
                    <CheckoutSteps one two />
                </Col>
            </Row>
            <FormContainer>
                <h1 className="text-center">Payment Details</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group>
                        <Form.Label as="legend" className="mt-4 mb-4">Select Method</Form.Label>
                        <Col>
                            <Form.Check
                                checked
                                id="PayPal"
                                label="PayPal"
                                value="PayPal"
                                role="button"
                                type="radio"
                                name="PaymentMethod"
                                className="my-3 fs-5"
                                onChange={(event) => setPaymentMethod(event.target.value)}
                            ></Form.Check>
                        </Col>
                    </Form.Group>
                    <Button type="submit" variant="primary" id="continue" className="mt-5">
                        Continue
                    </Button>
                </Form>
            </FormContainer>
        </>
    )
}

export default PaymentScreen