const postService = require('../services/posts.js');

module.exports = () => (req, res, next) => {
    req.storage = {
        ...postService
    };

    next();
};