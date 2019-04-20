const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    post: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now()},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comments'}],
    likes: [{type: Schema.Types.ObjectId, ref: 'Likes'}]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

PostSchema.virtual('totalLikes').get(function () {
    var totalLikes = 0;
    if (this.like.length) {
        totalLikes = this.likes.length;
    } else {
        totalLikes = 0;
    }
    return totalLikes;
});

module.exports = mongoose.model('Post', PostSchema);