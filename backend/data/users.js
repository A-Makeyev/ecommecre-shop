import bcrypt from 'bcryptjs'


const users = [
    {
        name: 'Admin User',
        email: 'admin@email.com',
        password: bcrypt.hashSync('12345', 10),
        isAdmin: true,
    },
    {
        name: 'Jhonny Duo',
        email: 'Jhonny@gmail.com',
        password: bcrypt.hashSync('12345', 10),
        isAdmin: true,
    },
    {
        name: 'Anazstasia Karzo',
        email: 'an.karz@hotmail.com',
        password: bcrypt.hashSync('12345', 10),
        isAdmin: true,
    },
]

export default users
