const express = require('express');
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');

const authMiddleware = require('../middlewares/auth.js');
const storageMiddleware = require('../middlewares/storage.js');

module.exports = (app) => {
    app.engine('hbs', engine({
        extname: '.hbs',
    }));
    app.set('view engine', 'hbs');

    app.use('/public', express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(authMiddleware());
    app.use(storageMiddleware());

    // app.use((req, res, next) => {
    //     if (!req.url.includes('favicon')) {
    //         console.log('>>>', req.method, req.url);

    //         if (req.user) {
    //             console.log('Known user', req.user.username);
    //         }
    //     }
    //     next();
    // });
};