const sql = require('sql-template-strings');
const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_users_the_db');

//Fo Cloud 9
// const client = new pg.Client({
//   host: 'localhost',
//   user: 'postgres',
//   password: 'password',
// });

client.connect();

const getUsers = () => {
  return client.query(sql`SELECT * from users`)
  .then(response => response.rows);
}
const getUser = (id) => {
  return client.query(sql`SELECT * from users WHERE id = $1`, [id])
  .then(response => response.rows[0])
}

const sync = () => {
  return client.query(SEED);
}

const SEED = sql`
  DROP TABLE IF EXISTS things;
  DROP TABLE IF EXISTS users;
  CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) unique
  );
  CREATE TABLE things(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    user_id integer references users(id)
  );
  INSERT INTO users(email) values('moe@example.com');
  INSERT INTO users(email) values('larry@example.com');
  INSERT INTO users(email) values('curly@example.com');
`;

module.exports = {
  getUser,
  getUsers,
  sync
}
