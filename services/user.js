const User = require('../models/User.js');

async function createUser(firstName, lastName, email, hashedPassword) {
    const user = new User({
        firstName,
        lastName,
        email,
        hashedPassword,
        myPosts: []
    });

    await user.save();

    return user;
}

async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i')
    const user = await User.findOne({ email: { $regex: pattern } });
    return user;
}

module.exports = {
    createUser,
    getUserByEmail
};