const router = require('express').Router();
const checkJwt = require('../middlewares/check-jwt');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');

router.post('/sendMessage/:sender_Id/:receiver_Id', checkJwt, (req, res) => {
    const {sender_Id, receiver_Id} = req.params;

    Conversation.find({
        $or: [
            {participants: {
                $elemMatch: {senderId: sender_Id, receiverId: receiver_Id},
                $elemMatch: {senderId: receiver_Id, receiverId: sender_Id}
            }}
        ]
    }, (err, conversation) => {
        if (err) return err;

        if (conversation.length > 0) {
            Message.update({conversationId: conversation._id}, {
                $push: {
                    message: {
                        senderId: sender_Id,
                        receiverId: receiver_Id,
                        senderName: req.body.senderName,
                        receiverNmae: req.body.receiverName,
                        body: req.body.message
                    }
                }
            }, (err) => {
                if (err) return err;

                res.json({
                    success: true,
                    message: 'Message sent'
                });
            });
        } else {
            let convo = new Conversation();
            let message = new Message();
            convo.participants.push({senderId: sender_Id, receiverId: receiver_Id});

            message.conversationId = convo._id;
            message.sender = req.body.senderName;
            message.receiver = req.body.receiverName;
            message.push({
                senderId: sender_Id,
                receiverId: receiver_Id,
                senderName: req.body.senderName,
                receiverNmae: req.body.receiverName,
                body: req.body.message
            });

            User.update({_id: sender_Id}, {
                $push: {
                    chatList: {
                        $each: [
                            {receiverId: receiver_Id, msgId: message._id}
                        ],
                        $position:0
                    }
                }
            })

            User.update({_id: receiver_Id}, {
                $push: {
                    chatList: {
                        $each: [
                            {receiverId: sender_Id, msgId: message._id}
                        ],
                        $position:0
                    }
                }
            })

            convo.save();
            message.save();
            res.json({
                success: true,
                message: 'Message sent'
            });
        }
    });
});











module.exports = router;