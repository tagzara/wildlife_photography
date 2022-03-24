const router = require('express').Router();
const { isUser } = require('../middlewares/guards.js');
const { parseError } = require('../utils/parsers.js');

router.get('/catalog', async (req, res) => {
    const posts = await req.storage.getAllPosts();
    const ctx = {
        posts,
        title: 'Catalog'
    }
    res.render('posts/catalog', ctx);
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

router.get('/details/:id', async (req, res) => {
    try {
        const post = await req.storage.getPostById(req.params.id);
        post.authorName = req.user.firstName + ' ' + req.user.lastName;

        // post.hasUser = Boolean(req.user);
        // post.isAuthor = req.user && req.user._id == post.author;
        // play.liked = req.user && play.usersLiked.find(u => u._id == req.user._id);

        res.render('posts/details', { post });
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const post = await req.storage.getPostById(req.params.id);

        // if (post.author != req.user._id) {
        //     throw new Error('Cannot edit post you haven\'t created!');
        // }

        res.render('posts/edit', { post });
    } catch (err) {
        console.log(err.message);
        res.redirect('/posts/details/' + req.params.id);
    }
});

router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const post = await req.storage.getPostById(req.params.id);

        if (post.author != req.user._id) {
            throw new Error('Cannot edit post you haven\'t created!');
        }

        await req.storage.editPost(req.params.id, req.body);

        res.redirect('/posts/details/' + req.params.id);
    } catch (err) {
        const ctx = {
            errors: parseError(err),
            post: {
                _id: req.params.id,
                title: req.body.title,
                keyword: req.body.keyword,
                location: req.body.location,
                createdAt: req.body.createdAt,
                imageUrl: req.body.imageUrl,
                description: req.body.description
            }
        }
        res.render('posts/edit', ctx);
    }
});

module.exports = router;