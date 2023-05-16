const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const User = require('../../models/users.model');
const TokenBlacklist = require('../../models/tokenblacklist.mongo');
const TokenWhitelist = require('../../models/tokenwhitelist.mongo');

async function httpRegisterUser(req, res) {
    try {
        const newCreatedUser = await User.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                isAdmin: req.body.isAdmin
            }
        )

        const { id, name, email, isAdmin } = newCreatedUser;

        res.status(201).json({ id, name, email, isAdmin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpLoginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) throw new Error('Incorrect email or password');

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) throw new Error('Incorrect email or password');

        const accessToken = jwt.sign(
            { _id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET_ACCESS_TOKEN,
            { expiresIn: '1d' }
        );

        await TokenWhitelist.create({ token: accessToken });
        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

async function httpLogoutUser(req, res) {
    try {
        const token = req.body.token;
        if (!token) throw new Error('Token is required');

        const whitelistedToken = await TokenWhitelist.findOne({ token });
        if (!whitelistedToken) return res.status(401).json({ message: 'Token Invaild' });

        await TokenBlacklist.create({ token });
        await TokenWhitelist.findOneAndDelete({ token });

        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    httpRegisterUser,
    httpLoginUser,
    httpLogoutUser,
}