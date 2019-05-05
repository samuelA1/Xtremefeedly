const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    post: {type: String, default: ''},
    imgVersion: {type: String, default: ''},
    imgId: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now},
    comments: [{
        comment: {type: Schema.Types.ObjectId, ref: 'Comments'},
        commentOwner: {type: Schema.Types.ObjectId, ref: 'User'},
        createdAt: {type: Date, default: Date.now} 
    }],
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    isLiked: {type: Boolean, default: false},
    isCommented: {type: Boolean, default: false}
});

module.exports = mongoose.model('Post', PostSchema);
