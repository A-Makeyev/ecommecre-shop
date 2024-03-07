import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { saveShippingAddress } from '../slices/cartSlice'
import FormContainer from '../components/FormContainer'
import GoBackButton from '../components/GoBackButton'
import CheckoutSteps from '../components/CheckoutSteps'


const ShippingScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart
    const [country, setCountry] = useState(shippingAddress?.country || '')
    const [city, setCity] = useState(shippingAddress?.city || '')
    const [address, setAddress] = useState(shippingAddress?.address || '')
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '')

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(saveShippingAddress({ country, city, address, postalCode }))
        navigate('/payment')
    }

    return (
        <>
            <GoBackButton url="/" />
            <FormContainer>
                <CheckoutSteps one two />
                <h1>Shipping</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="country" className="my-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            type="text"
                            value={country}
                            onChange={(event) => setCountry(event.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="city" className="my-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            type="text"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="address" className="my-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="postalCode" className="my-3">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                            type="text"
                            value={postalCode}
                            onChange={(event) => setPostalCode(event.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button type="submit" variant="primary" className="mt-2">
                        Continue
                    </Button>
                </Form>
            </FormContainer>
        </>
    )
}

export default ShippingScreen