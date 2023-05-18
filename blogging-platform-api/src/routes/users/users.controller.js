const mongoose = require('mongoose');

const User = require('../../models/users.model');
const handleError = require('../../utils/errors.handler');

async function httpGetUsers(req, res) {
    try {
        const users = await User.find({}, { '__v': 0, password: 0 })
            .sort('+surname')
            .select('-__v -createdAt -updatedAt -password -firstname -surname');

        if (users.length === 0) return res.status(404).json({ users: 'Not Found' });

        res.status(200).json({ users });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function httpGetUserByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ user: 'Invalid ID' });
        
        const user = await User.findById(req.params.id)
            .select('-_id -__v -password');

        if (!user) return res.status(404).json({ user: `Not Found` });

        res.status(200).json({ user });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function httpGetUsersCount(req, res) {
    try {
        const usersCount = await User.countDocuments();

        if (usersCount === 0) return res.status(204).json({ users: 'No Content' });

        res.status(200).json({ usersCount });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function httpUpdateUser(req, res) {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ user: 'Unauthorizated' });

        let fileName;
        let basePath;
        if (req.file) {
            fileName = req.file.filename;
            basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        }
        
        const updateUser = await User.findByIdAndUpdate(
            user._id,
            {
                firstname: req.body.firstname,
                surname: req.body.surname,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: `${basePath}${fileName}`
            },
            { new: true }
        )

        if (!updateUser) return res.status(304).json({ user: 'Not Modified' });

        res.status(200).json({ user: 'Modified' });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function httpDeleteUser(req, res) {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ error: 'Unauthorizated' });

        const deletedUser = await User.deleteOne({ _id: user._id });

        if (deletedUser.deletedCount === 0) return res.status(417)
            .json({ message: 'Expectation Failed' });

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    httpGetUsers,
    httpGetUserByID,
    httpGetUsersCount,
    httpUpdateUser,
    httpDeleteUser
}