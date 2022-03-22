const authController = require('../controllers/authController.js');
const homeController = require('../controllers/homeController.js');
const postsController = require('../controllers/postsController.js');

module.exports = (app) => {
    app.use('/auth', authController);
    app.use('/', homeController);
    app.use('/posts', postsController);
};