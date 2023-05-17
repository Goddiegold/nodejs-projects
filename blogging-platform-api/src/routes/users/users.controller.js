const mongoose = require('mongoose');

const User = require('../../models/users.model');

async function httpGetUsers(req, res) {
    try {
        const users = await User.find({}, { '__v': 0, password: 0 })
            .sort('+surname')
            .select('-__v -createdAt -updatedAt -password -firstname -surname');

        if (users.length === 0) return res.status(404).json({ error: 'No user found' });

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetUserByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid User Id');
        
        const user = await User.findById(req.params.id)
            .select('-_id -__v -password');

        if (!user) return res.status(404).json({ error: `User not found` });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetUsersCount(req, res) {
    try {
        const usersCount = await User.countDocuments();

        if (usersCount === 0) return res.status(404).json({ error: 'There is no user yet' });

        res.status(200).json({ usersCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpUpdateUser(req, res) {
    try {
        const { _id } = req.user;
        if (!_id) return res.status(404).json({ error: 'Unauthorizated' });

        let fileName;
        let basePath;
        if (req.file) {
            fileName = req.file.filename;
            basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        }
        
        const updateUser = await User.findByIdAndUpdate(
            _id,
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

        const updatedUser = await updateUser.save();

        const { firstname, surname, username, email, profilePicture } = updatedUser;
        res.status(200).json({ firstname, surname, username, email, profilePicture });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpDeleteUser(req, res) {
    try {
        const { _id } = req.user;
        if (!_id) return res.status(404).json({ error: 'Unauthorizated' });

        const user = await User.deleteOne({ _id });

        if (user.deletedCount === 0) return res.status(404).json({ error: 'User not deleted' });

        res.status(200).json({ message: 'User has been deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    httpGetUsers,
    httpGetUserByID,
    httpGetUsersCount,
    httpUpdateUser,
    httpDeleteUser
}