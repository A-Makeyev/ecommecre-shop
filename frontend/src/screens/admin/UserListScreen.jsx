import { Link } from 'react-router-dom'
import { Row, Col, Table } from 'react-bootstrap'
import { FaTimes, FaCheck, FaTrash, FaEdit } from 'react-icons/fa'
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice'
import { toast } from 'react-toastify'
import GoBackButton from '../../components/GoBackButton'
import Message from '../../components/Message'
import Loader from '../../components/Loader'


const UserListScreen = () => {
    const { data: users, isLoading, refetch, error } = useGetUsersQuery()
    const [deleteUser] = useDeleteUserMutation()
    const emptyUserList = JSON.stringify(users) === '[]'

    const deleteUserHandler = async (id, name) => {
        const selectedUser = users.filter((u) => u._id === id)[0]
        if (!selectedUser.isAdmin) {
            name = name.split(' ', 3).join(' ')
            if (window.confirm(`User "${name}" will be permanently deleted`)) {
                try {
                    await deleteUser(id)
                    toast.success(`Deleted ${name}`, { theme: "colored", hideProgressBar: true })
                    refetch()
                } catch (error) {
                    toast.error(error?.data?.message || error.error)
                }
            }
        }
    }

    return (
        <>
            <Row>
                <Col xs={4} sm={3} md={4} lg={2} xl={3}>
                    <GoBackButton text="Home" url="/" />
                </Col>
                <Col xs={5} sm={7} md={5} lg={8} xl={6} className="my-3 text-center">
                    <h1>{emptyUserList ? '' : 'Users'}</h1>
                </Col>
            </Row>

            {isLoading ? <Loader /> : error ? (
                <Message variant="danger" className="text-center">
                    {error?.data?.message || error.error}
                </Message>
            ) : emptyUserList ? (
                <Col className="mt-5 fs-1 text-center">
                    <h3>No Recent Users</h3>
                    <h1>¯\_(ツ)_/¯</h1>
                </Col>
            ) : (
                <Table striped bordered responsive className="table-sm mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>
                                    <Link to={`mailto:${user.email}`}>
                                        {user.email}
                                    </Link>
                                </td>
                                <td>
                                    {user.isAdmin ? (
                                        <FaCheck className="text-success fs-5" />
                                    ) : (
                                        <FaTimes className="text-danger fs-5" />
                                    )}
                                </td>
                                <td>
                                    <Link to={`/admin/user/${user._id}/edit`}>
                                        <FaEdit role="button" className="fs-5 m-1" />
                                    </Link>
                                </td>
                                <td>
                                    <FaTrash
                                        disabled={user.isAdmin}
                                        role={user.isAdmin ? undefined : "button"}
                                        style={user.isAdmin && { "cursor": "not-allowed" }}
                                        className={`fs-5 m-1 ${!user.isAdmin && "delete-icon"}`}
                                        onClick={() => deleteUserHandler(user._id, user.name)}
                                    />
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </Table>
            )}
        </>
    )
}

export default UserListScreen