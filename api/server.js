require('dotenv').config();
const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
const knex = require("knex");
const bcrypt = require('bcryptjs');

const knexConfig = require("../knexfile");
const db = process.env.NODE_ENV ? knex(knexConfig.production) : knex(knexConfig.development);
const noteRouter = require("../notes/noteRouter");
const userRouter = require("../users/userRouter");
const { authenticate, generateToken } = require('../middleware.js');
const saltRounds = +process.env.hash || require("../_secrets/keys.js").hash
const { addLocalNotesToDB, loginUser } = require("../helpers");

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

// sanity check route
server.get("/", (req, res) => {
  res.status(200).json({
    api: "running"
  });
})

// note routes
server.use("/api/notes", noteRouter);

// user routes
server.use("/api/users", userRouter);

server.post("/api/register", (req, res) => {
  const { password, username } = req.body.creds;
  checkCredentials(req, res)

  const hash = bcrypt.hashSync(password, saltRounds);
  password = hash;

  db("users")
    .insert(creds, 'id')
    .then(ids => {
      db("notes")
        .insert({
          title: `Welcome to Paper Notes, ${username}`,
          content: "I hope you enjoy using this site.",
          user_id: ids[0]
        })
        .then(() => {
          res.status(200).json({ message: `welcome, ${username}` })
      })
        .catch(err => console.log(err))
    })
    .catch(err => res.status(401).json(err))
})

server.post("/api/login", (req, res) => {
  const { creds, notes } = req.body;
  let userId;

  if (!creds.username) {
    return res.status(400).json({
      error: "Please enter a username."
    });
  }

  if (!creds.password) {
    return res.status(400).json({
      error: "Please enter a password."
    });
  }

  db('users')
    .where({
      username: creds.username
    })
    .first()
    .then(user => {
      userId = user.id;
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);
        addLocalNotesToDB(notes, db);
        loginUser(notes, db, token, res);
      } else {
        res.status(401).json({
          message: 'you shall not pass!!'
        });
      }
    })
    .catch(err => res.json(err));
})


module.exports = server;
