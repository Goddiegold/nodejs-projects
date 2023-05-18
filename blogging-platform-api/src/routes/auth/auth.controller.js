const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const User = require('../../models/users.model');
const TokenBlacklist = require('../../models/tokenblacklist.model');
const handleError = require('../../utils/errors.handler');

async function httpRegisterUser(req, res) {
    try {
        const newCreatedUser = await User.create(
            {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                isAdmin: req.body.isAdmin
            }
        )
        
        if (!newCreatedUser) return res.status(501).json({ registration: 'Not Implemented' });

        res.status(201).json({ user: 'Created' });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function httpLoginUser(req, res) {
    try {
        const { username, email, password } = req.body;
        let user;

        if (username) {
            const formattedUsername = username.trim().replace(/\s/g, '');
            user = await User.findOne({ username: formattedUsername });
        }

        if (email) {
            const formattedEmail = email.trim().toLowerCase();
            user = await User.findOne({ email: formattedEmail });
        }

        if (!user) return res.status(401).json({ message: 'Incorrect credentials' });

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) return res.status(401).json({ message: 'Incorrect credentials' });

        const accessToken = jwt.sign(
            { _id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET_ACCESS_TOKEN,
            { expiresIn: '1d' }
        );

        if (!accessToken) return res.status(501).json({ message: 'Login failed' });

        res.status(200).json({ accessToken });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function httpLogoutUser(req, res) {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

        const token = authHeader.split(' ')[1];

        const blacklist = await TokenBlacklist.create({ token });

        if(!blacklist) return res.status(501).json({ logout: 'Not Implemented' })

        res.header('Content-Type', 'application/json');

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    httpRegisterUser,
    httpLoginUser,
    httpLogoutUser,
}