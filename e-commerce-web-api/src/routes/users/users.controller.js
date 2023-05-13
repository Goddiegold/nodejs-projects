const User = require('../../models/users.model');

async function httpGetUsers(req, res) {
    try {
        const users = await User.find({}, { '__v': 0, password: 0});

        if (users.length === 0) return res.status(404).json({ error: 'No user found' });

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetUserByID(req, res) {
    try {
        const id = req.params.id
        const user = await User.findById(id, { '__v': 0, password: 0});

        if (!user) return res.status(404)
            .json({ error: `User with ID ${id} not found` });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpRegisterUser(req, res) {
    try {
        const newCreatedUser = await User.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country
            }
        )

        res.status(201).json({ newCreatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpUpdateUser(req, res) {
    try {
        const id = await User.findById(req.params.id);

        if (!id) return res.status(404).json({ error: 'User not found' });

        const user = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country
            },
            { new: true }
        )

        const updatedUser = await user.save();

        res.status(200).json({ updatedUser });
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
    httpRegisterUser,
    httpUpdateUser,
    httpDeleteUser
}