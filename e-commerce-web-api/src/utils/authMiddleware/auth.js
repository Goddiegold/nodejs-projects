const jwt = require("jsonwebtoken");

const TokenBlacklist = require('../../models/tokenblacklist.mongo');

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

async function authUser(req, res, next) {
    authToken(req, res, () => {
        if (req.user._id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    })
}

async function authAdmin(req, res, next) {
    authToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    })
}

module.exports = { authToken, authUser, authAdmin };