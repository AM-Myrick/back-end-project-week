const express = require('express');
const knex = require("knex");
const knexConfig = require("../knexfile");
const db = process.env.NODE_ENV ? knex(knexConfig.production) : knex(knexConfig.development);
const router = express.Router();
const { authenticate } = require('../middleware.js');

router.get("/", (req, res) => {
    db("users")
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({error: err}))
})

router.patch("/change-password", authenticate, (req, res) => {
    const { username } = req.decoded;
    const { password } = req.body;

    if (password === null) {
        return res.status(405).json({error: "Please enter a password."});
    }

    db("users")
        .where({ username })
        .first()
        .update({ password })
        .then(count => res.status(200).json(count))
        .catch(error => res.status(500).json({error}))
})

module.exports = router;