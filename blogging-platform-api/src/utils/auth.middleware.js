const jwt = require("jsonwebtoken");

const TokenBlacklist = require('../models/tokenblacklist.model');
const handleError = require('./errors.handler');

async function authToken(req, res, next) {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

        const token = authHeader.split(' ')[1];

        const blacklistedToken = await TokenBlacklist.findOne({ token });
        if (blacklistedToken) return res.status(401).json({ message: 'Unauthorized' });

        jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN, (err, user) => {
            if (err) res.status(403).json({ message: 'Token is not valid!' });

            req.user = user;
            next();
        });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function authAdmin(req, res, next) {
    try {
        await authToken(req, res, () => {
            if (req.user.isAdmin) {
                next();
            } else {
                res.status(403).json({ message: 'Unauthorized' });
            }
        })
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { authToken, authAdmin };