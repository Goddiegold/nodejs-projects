const bcrypt = require('bcrypt');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const User = require('../../models/users.model');
const TokenBlacklist = require('../../models/tokenblacklist.mongo');
const TokenWhitelist = require('../../models/tokenwhitelist.mongo');

// Handle user login request
async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        // Check if user with given email exists in database
        if (!user) throw new Error('Incorrect email or password');

        // decrypt the password
        const auth = await bcrypt.compare(password, user.password);
            
        // Check if provided password matches the one in the database
        if (!auth) throw new Error('Incorrect email or password');

        // Generate JWT token and send it to the client
        const accessToken = jwt.sign(
            { _id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET_ACCESS_TOKEN,
            { expiresIn: '24h' }
        );
        
        // Add the token to the whitelist
        const whitelistedToken = new TokenWhitelist({ token: accessToken });
        await whitelistedToken.save();

        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

// Handle user logout request
async function logout(req, res) {
    try {
        // Extract the Authorization header and the token from it
        const token = req.body.token;

        if (!token) throw new Error('Token is required');

        // Check if token is in the whitelist
        const whitelistedToken = await TokenWhitelist.findOne({ token });
        if (!whitelistedToken) return res.status(401).json({ message: 'Token Invaild' });

        // Add the token to the blacklist
        const blacklistedToken = new TokenBlacklist({ token });
        await blacklistedToken.save();

        await TokenWhitelist.findOneAndDelete({ token });

        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Middleware to authenticate requests for Admin
async function authenticateTokenAdmin(req, res, next) {
    try {
        // Extract the Authorization header and the token from it
        const authHeader = req.header('Authorization');

        // If no authHeader is present, return an error response
        if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

        const token = authHeader.split(' ')[1];

        // Check if token is in the blacklist
        const blacklistedToken = await TokenBlacklist.findOne({ token });
        if (blacklistedToken) return res.status(401).json({ message: 'Unauthorized' });

        const revoked = async (req, payload, done) => {
            if (!payload.isAdmin) {
                done(null, true)
            }

            done();
        }

        // Verify the token and pass the decoded payload to the next middleware
        const jwtCheck = expressJwt({
            secret: process.env.JWT_SECRET_ACCESS_TOKEN,
            algorithms: process.env.JWT_ALGORITHM,
            isRevoked: revoked
        })

        jwtCheck(req, res, next);
    } catch (error) {
        res.status(401).json({ Error: error.message });
    }
}

// Middleware to authenticate requests for customers
async function authenticateTokenCustomer(req, res, next) {
    try {
        // Extract the Authorization header and the token from it
        const authHeader = req.header('Authorization');

        // If no authHeader is present, return an error response
        if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

        const token = authHeader.split(' ')[1];

        // Check if token is in the blacklist
        const blacklistedToken = await TokenBlacklist.findOne({ token });
        if (blacklistedToken) return res.status(401).json({ message: 'Unauthorized' });

        // Verify the token and pass the decoded payload to the next middleware
        const jwtCheck = expressJwt({
            secret: process.env.JWT_SECRET_ACCESS_TOKEN,
            algorithms: process.env.JWT_ALGORITHM,
        });

        jwtCheck(req, res, next);
    } catch (error) {
        res.status(401).json({ Error: error.message });
    }
}

module.exports = {
    login,
    logout,
    authenticateTokenAdmin,
    authenticateTokenCustomer
}