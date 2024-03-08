import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'


const CheckoutSteps = ({ one, two, three }) => {
    return (
        <Nav className="justify-content-center mb-5 fs-5">
            <Nav.Item>
                {one ? (
                    <LinkContainer to="/shipping">
                        <Nav.Link>Shipping</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Shipping</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {two ? (
                    <LinkContainer to="/payment">
                        <Nav.Link>Payment</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Payment</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {three ? (
                    <LinkContainer to="/placeorder">
                        <Nav.Link>Place Order</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Place Order</Nav.Link>
                )}
            </Nav.Item>
        </Nav>
    )
}

export default CheckoutSteps