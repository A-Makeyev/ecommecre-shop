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
    const { userInfo } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)
    const quantity = cartItems.reduce((accumulator, currentItem) => accumulator + currentItem.qty, 0)
    const displayQuantity = (quantity && quantity > 999) ? `${String(quantity)[0]}K` : quantity ? quantity : ""
    const displayCartCountClass = quantity ? "cart-item-count" : "cart-item-count-invisible"
    const shortenedProductName = quantity > 0 && cartItems[0].name.split(' ', 3).join(' ')
    const logOutMessage = quantity === 1 ? `Hey don't forget about your ${shortenedProductName}!`
        : quantity === 2 ? `${shortenedProductName} and one more item are waiting!`
            : quantity > 1 ? `${shortenedProductName} and ${quantity - 1} more items are waiting!`
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
                                <NavDropdown title={userInfo.name.split(' ')[0]} id="username" className="fs-5">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item id="profile" className="text-center">
                                            Profile
                                        </NavDropdown.Item>
                                    </LinkContainer>

                                    {userInfo.isAdmin && (
                                        <>
                                            <LinkContainer to="/admin/productlist">
                                                <NavDropdown.Item className="text-center">
                                                    Products
                                                </NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/admin/orderlist">
                                                <NavDropdown.Item className="text-center">
                                                    Orders
                                                </NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/admin/userlist">
                                                <NavDropdown.Item className="text-center">
                                                    Users
                                                </NavDropdown.Item>
                                            </LinkContainer>
                                        </>
                                    )}

                                    <NavDropdown.Item onClick={logoutHandler} className="text-center">
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