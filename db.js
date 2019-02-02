const pg = require('pg');
//For local machine
// const client = new pg.Client('postgres://localhost/acme_users_the_db');

//Fo Cloud 9
const client = new pg.Client({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
})

const getUsers = ()=> {
    return client.query('SELECT * from users')
    .then(response => response.rows);
};

const getUser = (id)=> {
    return client.query('SELECT * from users WHERE id = $1', [id])
    .then(response => response.rows[0]);
};

const SEED = `
DROP TABLE IF EXISTS users;
CREATE TABLE users(
id SERIAL PRIMARY KEY,
email VARCHAR(100) unique
);
INSERT INTO users(email) values('moe@example.com');
INSERT INTO users(email) values('larry@example.com');
INSERT INTO users(email) values('curly@example.com');
`;


client.connect()
.then(() => client.query(SEED))
.then(table => getUsers())
.then(users => users.reduce((acc, user) => {
    acc[user.email] = user;
    return acc;
}, {})
)
.then(userMap => {
    const larrysId = userMap['larry@example.com'].id;
    return getUser(larrysId);
})
.then(larry => console.log(larry))
.catch(ex => console.log(ex));




