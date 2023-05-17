const jwt = require("jsonwebtoken");

const TokenBlacklist = require('../models/tokenblacklist.model');

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
        res.status(500).json({ message: error.message });
    }
}

module.exports = { authToken };