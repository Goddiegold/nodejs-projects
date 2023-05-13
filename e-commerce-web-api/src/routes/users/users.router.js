const express = require('express');
const usersRouter = express.Router();
const { authenticateToken } = require('../authenticate/auth.controller');

const {
    httpGetUsers,
    httpGetUserByID,
    httpRegisterUser,
    httpUpdateUser,
    httpDeleteUser
} = require('./users.controller')

usersRouter.get('/', httpGetUsers);
usersRouter.get('/:id', httpGetUserByID);
usersRouter.post('/register', httpRegisterUser);
usersRouter.put('/:id', authenticateToken, httpUpdateUser);
usersRouter.delete('/:id', authenticateToken, httpDeleteUser);

module.exports = usersRouter;