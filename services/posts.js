const Post = require('../models/Post.js');

async function getAllPosts() {
    const posts = await Post.find({}).lean();

    return posts;
}

async function getPostById(id) {
    const post = await Post.findById(id).lean();

    return post;
}


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

async function editPost(id, postData) {
    const post = await Post.findById(id);

    post.title = postData.title;
    post.keyword = postData.keyword;
    post.location = postData.location;
    post.createdAt = postData.createdAt;
    post.imageUrl = postData.imageUrl;
    post.description = postData.description;

    return post.save();
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    editPost
};