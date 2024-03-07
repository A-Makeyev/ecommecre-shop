import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Form, Button } from 'react-bootstrap'
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
            <GoBackButton url="/shipping" />
            <FormContainer>
                <CheckoutSteps one two three />
                <h1>Payment Method</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group>
                        <Form.Label as="legend">Select Method</Form.Label>
                        <Col>
                            <Form.Check
                                type="radio"
                                id="PayPal"
                                name="PaymentMethod"
                                label="PayPal or Credit Card"
                                className="my-3"
                                value="PayPal"
                                checked
                                onChange={(event) => setPaymentMethod(event.target.value)}
                            ></Form.Check>
                        </Col>
                    </Form.Group>
                    <Button type="submit" variant="primary">
                        Continue
                    </Button>
                </Form>
            </FormContainer>
        </>
    )
}

export default PaymentScreen