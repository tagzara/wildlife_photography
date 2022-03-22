const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: { type: String, required: true },
    keyword: { type: String, required: true },
    location: { type: String, required: true },
    createdAt: { type: String, required: true },
    imageUrl: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    usersVotes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    postRating: { type: Number, default: 0 }
});

module.exports = model('Post', schema);