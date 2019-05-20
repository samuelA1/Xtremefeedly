const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const ConversationSchema = new Schema({
    participants: [
        {
          senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
      ]
})
module.exports = mongoose.model('Conversation', ConversationSchema);