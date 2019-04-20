const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikesSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Likes', LikesSchema);