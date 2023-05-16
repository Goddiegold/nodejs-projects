const mongoose = require('mongoose');

const User = require('../../models/users.model');

async function httpGetUsers(req, res) {
    try {
        const users = await User.find({}, { '__v': 0, password: 0 }).sort({ name: +1 });

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
        
        const user = await User.findById(req.params.id, { '__v': 0, password: 0});

        if (!user) return res.status(404).json({ error: `User not found` });

        const { name, email, isAdmin } = user;

        res.status(200).json({ name, email, isAdmin });
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
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid User Id');
        
        const userId = await User.findById(req.params.id);
        if (!userId) return res.status(404).json({ error: 'User not found' });

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            },
            { new: true }
        )

        const updatedUser = await user.save();

        const { id, name, email } = updatedUser;
        res.status(200).json({ id, name, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpDeleteUser(req, res) {
    try {
        const user = await User.deleteOne({ _id: req.params.id });

        if (user.deletedCount === 0) return res.status(404).json({ error: 'User not found' });

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