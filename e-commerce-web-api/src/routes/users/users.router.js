const express = require('express');
const usersRouter = express.Router();

usersRouter.get('/', (req, res) => {
    res.status(200).json({
        id: 1,
        name: 'users'
    })
})

module.exports = usersRouter;