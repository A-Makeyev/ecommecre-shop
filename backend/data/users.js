import bcrypt from 'bcryptjs'


const users = [
    {
        name: 'Admin',
        email: 'admin@email.com',
        password: bcrypt.hashSync('admin', 12),
        isAdmin: true,
    },
    {
        name: 'Tolik Makeyev',
        email: 'anatoly.makeyev@cloudbeat.io',
        password: bcrypt.hashSync('iLoveSpaceX69', 10),
        isAdmin: false,
    },
    {
        name: 'Avital Shtivelberg',
        email: 'tallishtiv@gmail.com',
        password: bcrypt.hashSync('ASH1997', 10),
        isAdmin: false,
    },
    {
        name: 'Anazstasia Karzo',
        email: 'an.karz@hotmail.com',
        password: bcrypt.hashSync('karzova', 10),
        isAdmin: false,
    },
    {
        name: 'Jhonny Duo',
        email: 'Jhonny@gmail.com',
        password: bcrypt.hashSync('12345', 10),
        isAdmin: false,
    },
]

export default users
