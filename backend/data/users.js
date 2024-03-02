import bcrypt from 'bcryptjs'


const users = [
    {
        name: 'Admin User',
        email: 'admin@email.com',
        password: bcrypt.hashSync('admin', 12),
        isAdmin: true,
    },
    {
        name: 'Jhonny Duo',
        email: 'Jhonny@gmail.com',
        password: bcrypt.hashSync('12345', 10),
        isAdmin: false,
    },
    {
        name: 'Anazstasia Karzo',
        email: 'an.karz@hotmail.com',
        password: bcrypt.hashSync('karzova', 10),
        isAdmin: false,
    },
    {
        name: 'Avital Shtivelberg',
        email: 'tallishtiv@gmail.com',
        password: bcrypt.hashSync('ash1997', 10),
        isAdmin: false,
    },
]

export default users
