import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { logout } from '../slices/authSlice'
import { toast } from 'react-toastify'
import logo from '../assets/logo.png'


const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [logoutApiCall] = useLogoutMutation()
    const { cartItems } = useSelector((state) => state.cart)
    const { userInfo } = useSelector((state) => state.auth)
    const quantity = cartItems.reduce((accumulator, currentItem) => accumulator + currentItem.qty, 0)
    const displayQuantity = (quantity && quantity > 999) ? `${String(quantity)[0]}K` : quantity ? quantity : ""
    const displayCartCountClass = quantity ? "cart-item-count" : "cart-item-count-invisible"
    const logOutMessage = quantity === 1 ? `Hey don't forget about your ${cartItems[0].name.split(' ', 3).join(' ')}!`
                        : quantity > 1 ? `${cartItems[0].name.split(' ', 3).join(' ')} and ${quantity - 1} more items are waiting!`
                        : 'See you soon'

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            window.location.href.includes('/profile') && navigate('/')
            quantity >= 1 ? toast.info(logOutMessage) : toast(logOutMessage)
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }

    return (
        <header className="sticky-top">
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

                            <LinkContainer to="/cart">
                                <Nav.Link className="fs-5">
                                    <FaShoppingCart className="me-2 mb-1" />
                                    <span className={displayCartCountClass} value={displayQuantity}>
                                        Cart
                                    </span>
                                </Nav.Link>
                            </LinkContainer>

                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id="username" className="fs-5">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link className="fs-5">
                                        <FaUser className="me-2 mb-2" />
                                        Login
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header