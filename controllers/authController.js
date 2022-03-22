const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewares/guards.js');

router.get('/register', isGuest(), (req, res) => {
    res.render('user/register');
});

router.post(
    '/register',
    isGuest(),
    body('firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long!').bail()
    .isAlpha('en-US').withMessage('First name may contain only English letters!'),
    body('lastName').isLength({ min: 5 }).withMessage('Last name must be at least 5 characters long!').bail()
    .isAlpha('en-US').withMessage('Last name may contain only English letters!'),
    body('email').isEmail().withMessage('Email must be valid URL!'),
    body('password').isLength({ min: 4} ).withMessage('Password must be at least 4 characters long!'),
    body('repeatPassword').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Password don\'t match');
        }
        return true;
    }),
    async (req, res) => {
        console.log(req.body);
        const { errors } = validationResult(req);

        try {
            if (errors.length > 0) {
                throw new Error(Object.values(errors).map(e => e.msg).join('\n'));
            }

            await req.auth.register(req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim(), req.body.password.trim());

            console.log(errors);
            res.redirect('/');
        } catch (err) {
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email
                }
            };
            res.render('user/register', ctx);
        }
    }
);

router.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        await req.auth.login(req.body.username, req.body.password);

        res.redirect('/');
    } catch (err) {
        console.log(err);
        const ctx = {
            errors: [err.message],
            userData: {
                username: req.body.username
            }
        };
        res.render('login', ctx);
    }
});

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
});

module.exports = router;