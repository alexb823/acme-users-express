const express = require('express');
const html = require('html-template-tag');
const db = require('./db');

const app = express();
module.exports = app;

app.use((req, res, next) => {
  db.getUsers()
    .then(users => {
      req.users = users;
      next();
    })
    .catch(next);
});

app.get('/', (req, res, next) => {
  const user = req.users[0];
  res.redirect(`/users/${user.id}`);
});

app.get('/users/:id', (req, res, next) => {
  db.getUser(req.params.id)
    .then(user =>
      res.send(html`
        <html>
          <head>
            <link
              rel="stylesheet"
              href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
              integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
              crossorigin="anonymous"
            />
          </head>
          <body>
            <div class="container">
              <ul class="nav">
                ${req.users.map(user => {
                  return html`
                    <li class="nav-item"><a class="nav-link" href="/users/${user.id}">${user.email}</a></li>
                  `;
                })}
              </ul>
              <div class="mt-3">
                <h3>you chose ${user.email}</h3>
              </div>
            </div>
          </body>
        </html>
      `)
    )
    .catch(next);
});
