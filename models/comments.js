const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    comment: String,
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Comments', CommentsSchema);