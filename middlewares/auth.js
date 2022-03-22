const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { TOKEN_SECRET, COOKIE_NAME } = require('../config');
const userService = require('../services/user.js');

module.exports = () => (req, res, next) => {
    if (parseToken(req, res)) {
        req.auth = {
            async register(firstName, lastName, email, password) {
                const token = await register(firstName, lastName, email, password);
                res.cookie(COOKIE_NAME, token);
            },
            async login(firstName, lastName, email, password) {
                const token = await login(firstName, lastName, email, password);
                res.cookie(COOKIE_NAME, token);
            },
            logout() {
                res.clearCookie(COOKIE_NAME);
            }
        };

        next();
    }
};

async function register(firstName, lastName, email, password) {
    // TODO adapt parameters to project requirements
    // TODO extra validations
    const existing = await userService.getUserByEmail(email);

    if (existing) {
        throw new Error('There already have a user with that email!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser(firstName, lastName, email, hashedPassword);

    return generateToken(user);
}

async function login(username, password) {
    const user = await userService.getUserByUsername(username);

    if (!user) {
        throw new Error('No such user!');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorect password!');
    }

    return generateToken(user);
}

function generateToken(userData) {
    return jwt.sign({
        _id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
    }, TOKEN_SECRET);
}

function parseToken(req, res) {
    const token = req.cookies[COOKIE_NAME];
    if (token) {
        try {
            const userData = jwt.verify(token, TOKEN_SECRET);
            req.user = userData;
            res.locals.user = userData;
        } catch (err) {
            res.clearCookie(COOKIE_NAME);
            res.redirect('/auth/login');

            return false;
        }
    }
    return true;
}
