import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice'
import { useLogoutMutation, useProfileMutation } from '../../slices/usersApiSlice'
import { logout, setCredentials } from '../../slices/authSlice'
import { toast } from 'react-toastify'
import FormContainer from '../../components/FormContainer'
import GoBackButton from '../../components/GoBackButton'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Meta from '../../components/Meta'


const UserEditScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id: userId } = useParams()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [logoutApiCall] = useLogoutMutation()
    const [updateUser, { isLoading: updatingUser }] = useUpdateUserMutation()
    const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId)
    const [updateProfile] = useProfileMutation()

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin)
            document.getElementById('user-header').textContent = user.name.split(' ', 3).join(' ')
        }
    }, [user])

    const currentUserWasAdmin = () => {
        const username = document.getElementById('username').textContent
        return user.name.includes(username) && user.isAdmin
    }

    const adminWarningHandler = () => {
        if (currentUserWasAdmin()) {
            alert('You will be removed from an admin role')
        }
    }

    const updateHandler = async (event) => {
        event.preventDefault()

        const uppdatedUser = {
            userId,
            name,
            email,
            isAdmin
        }

        const result = await updateUser(uppdatedUser)
        const userWasAdmin = currentUserWasAdmin()
        if (result.error) {
            toast.error(
                result.error, 
                { theme: "colored", hideProgressBar: true }
            )
        } else {
            if (currentUserWasAdmin()) {
                const response = await updateProfile(uppdatedUser).unwrap()
                dispatch(setCredentials(response))
            }

            if (userWasAdmin && !result.data.isAdmin) {
                try {
                    await logoutApiCall().unwrap()
                    dispatch(logout())
                    toast.info(
                        `${result.data.name} you removed yourself from an admin role`,
                        { theme: "colored", hideProgressBar: true }
                    )
                } catch (error) {
                    toast.error(
                        error?.data?.message || error.error, 
                        { theme: "colored", hideProgressBar: true }
                    )
                }
            } else {
                refetch()
                navigate('/admin/userlist')
                toast.success(
                    `Updated ${result.data.name}`,
                    { theme: "colored", hideProgressBar: true }
                )
            }
        }
    }

    return (
        <> 
            <Row>
                <Col md={3} lg={2} xl={2}>
                    <GoBackButton text="Users" url="/admin/userlist" />
                </Col>
                <Col sm={13} md={6} lg={8} xl={8} className="my-3">
                    <h1 id="user-header" className="text-center">
                        {!user && 'Update User'}
                    </h1>
                </Col>
            </Row>
            {isLoading ? <Loader /> : error ? (
                <Message variant="danger" className="text-center">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <Meta title={`Shop | Edit ${user.name.split(' ', 2).join(' ')}`} />
                    <FormContainer>
                        <Form>
                            <Form.Group controlId="name" className="my-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="email" className="my-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Row>
                                <Col xs={3} sm={3} md={2} lg={2}>
                                    <Form.Group controlId="isAdmin">
                                        <Form.Check
                                            type="checkbox"
                                            label="Admin"
                                            checked={isAdmin}
                                            onChange={() => setIsAdmin(true)}
                                        >
                                        </Form.Check>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="regularUser">
                                        <Form.Check
                                            type="checkbox"
                                            label="Regular User"
                                            checked={!isAdmin}
                                            onChange={() => setIsAdmin(false)}
                                            onClick={adminWarningHandler}
                                        >
                                        </Form.Check>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button onClick={(event) => updateHandler(event)} type="submit" variant="primary" id="save-user" className="my-3 w-100">
                                {updatingUser ? <Loader update /> : 'Save'}
                            </Button>

                        </Form>
                    </FormContainer>
                </>
            )}
        </>
    )
}

export default UserEditScreen