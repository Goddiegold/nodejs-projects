const authRouter = require('express').Router();

const { authToken } = require('../../utils/auth.middleware');
const { httpRegisterUser, httpLoginUser, httpLogoutUser } = require('./auth.controller');

// Sign up or open an account (Public)
authRouter.post('/register', httpRegisterUser);
// Sign in and gain access to more information (Public)
authRouter.post('/login', httpLoginUser);
// Sign out and logout (Private)
authRouter.post('/logout', authToken, httpLogoutUser);

module.exports = authRouter;