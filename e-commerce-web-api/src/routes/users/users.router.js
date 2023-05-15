const express = require('express');
const usersRouter = express.Router();
// const { authenticateToken } = require('../authenticate/auth.controller');

const {
    httpGetUsers,
    httpGetUserByID,
    httpGetUsersCount,
    httpRegisterUser,
    httpUpdateUser,
    httpDeleteUser
} = require('./users.controller')

usersRouter.get('/', httpGetUsers);
usersRouter.get('/:id', httpGetUserByID);
productsRouter.get('/get/count', httpGetUsersCount);
usersRouter.post('/register', httpRegisterUser);
usersRouter.put('/:id', httpUpdateUser);
usersRouter.delete('/:id', httpDeleteUser);

module.exports = usersRouter;