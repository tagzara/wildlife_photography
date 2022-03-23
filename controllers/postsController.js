const router = require('express').Router();
const { isUser } = require('../middlewares/guards.js');
const { parseError } = require('../utils/parsers.js');
// const Post = require('../models/Post.js');

router.get('/catalog', (req, res) => {
    res.render('posts/catalog', { title: 'Catalog' });
});

router.get('/create', isUser(), (req, res) => {
    res.render('posts/create');
});

router.post('/create', isUser(), async (req, res) => {
    console.log(req.body);

    try {
        // extract model data and forward to service
        const postData = {
            title: req.body.title.trim(),
            keyword: req.body.keyword.trim(),
            location: req.body.location.trim(),
            createdAt: req.body.createdAt.trim(),
            imageUrl: req.body.imageUrl.trim(),
            description: req.body.description.trim(),
            author: req.user._id
        };
        
        await req.storage.createPost(postData);

        res.redirect('/');
    } catch (err) {
        //  parse mongoose error object
        console.log(err.message);

        const ctx = {
            errors: parseError(err),
            postData: {
                title: req.body.title,
                keyword: req.body.keyword,
                location: req.body.location,
                createdAt: req.body.createdAt,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
            }
        };
        res.render('posts/create', ctx);
    }
});

module.exports = router;