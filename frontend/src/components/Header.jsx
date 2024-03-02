import { Navbar, Nav, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import logo from '../assets/logo.png'

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart)
    const quantity = cartItems.reduce((accumulator, currentItem) => accumulator + currentItem.qty, 0)
    const displayCartCount = quantity ? "cart-item-count" : "cart-item-count-invisible"

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <img src={logo} alt="Shop"></img>
                            Shop
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <LinkContainer to="/login">
                                <Nav.Link className="fs-5">
                                    <FaUser className="me-2 mb-2" />
                                    Login
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/cart">
                                <Nav.Link className="fs-5">
                                    <FaShoppingCart className="me-2 mb-1" />
                                    <span className={displayCartCount} value={quantity ? quantity : ""}>
                                        Cart
                                    </span>
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header