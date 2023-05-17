const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const User = require('../../models/users.model');
const TokenBlacklist = require('../../models/tokenblacklist.model');

async function httpRegisterUser(req, res) {
    try {
        const newCreatedUser = await User.create(
            {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
        )

        const { _id, username, email } = newCreatedUser;

        res.status(201).json({ _id, username, email });
    } catch (error) {
        res.status(401).json({ error: error.message });
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

        if (!user) return res.status(401).json('Incorrect credentials')

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) return res.status(401).json('Incorrect credentials')

        const accessToken = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET_ACCESS_TOKEN,
            { expiresIn: '1d' }
        );

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

async function httpLogoutUser(req, res) {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

        const token = authHeader.split(' ')[1];

        await TokenBlacklist.create({ token });

        res.header('Content-Type', 'application/json');

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    httpRegisterUser,
    httpLoginUser,
    httpLogoutUser,
}