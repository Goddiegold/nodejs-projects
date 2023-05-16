const authRouter = require('express').Router();

const { httpRegisterUser, httpLoginUser, httpLogoutUser } = require('./auth.controller');
const { authUser } = require('../../utils/authMiddleware/auth');

authRouter.post('/register', httpRegisterUser);
authRouter.post('/login', httpLoginUser);
authRouter.post('/logout', authUser, httpLogoutUser);

module.exports = authRouter;