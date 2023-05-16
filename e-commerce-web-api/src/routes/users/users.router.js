const usersRouter = require('express').Router();
const { authUser } = require('../../utils/authMiddleware/auth');

const {
    httpGetUsers,
    httpGetUserByID,
    httpGetUsersCount,
    httpUpdateUser,
    httpDeleteUser
} = require('./users.controller')

// Get users in our platform (Public)
usersRouter.get('/', httpGetUsers);
// Get specific users in our platform (Public)
usersRouter.get('/:id', httpGetUserByID);
// Get total users number in our platform (Public)
usersRouter.get('/get/count', httpGetUsersCount);
// User update themselves (Private)
usersRouter.put('/:id', authUser, httpUpdateUser);
// User revoke their account (Private)
usersRouter.delete('/:id', authUser, httpDeleteUser);

module.exports = usersRouter;