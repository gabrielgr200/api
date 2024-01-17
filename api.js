const express = require("express");
const api = express();
const db = require("./db/models");
const users = require('./controllers/users');

const port = 3440

api.use(express.json());
api.use('/', users);

api.listen(process.env.PORT || port, () => {
    console.log("teste: http://localhost:3440");
});