const Post = require('../models/Post.js');

async function createPost(postData) {
    const pattern = new RegExp(`^${postData.title}$` , 'i');
    const existing = await Post.findOne({ title: { $regex: pattern } });

    if (existing) {
        throw new Error('A post with this name already exists!');
    }

    const post = new Post(postData);

    await post.save();

    return post;
}

module.exports = {
    createPost
};