const router = require('express').Router();
const Likes = require('../models/likes');
const Post = require('../models/post');
const async = require('async');
const checkJwt = require('../middlewares/check-jwt');

router.route('/likes/:id')
    .post(checkJwt, (req, res) => {
        const postId = req.params.id;
        async.waterfall([
            function (callback) {
                let likes = new Likes();
                likes.owner = req.decoded.user._id;
                callback(err, likes)
            }, 
            function (likes) {
                Post.findById(postId, (err, post) => {
                    if (err) return err;

                    post.likes = likes._id;
                    likes.save();
                    post.save();
                    res.status(200).json({
                       success: true,
                       message: 'You liked a post' 
                    });
                })
            }
        ]);
    })
    .get(checkJwt, (req, res) => {
        const postId = req.params.id;
        Post.findById(postId)
        .select('likes')
        .populate('likes')
        .exec((err, likes) => {
            if (err) return err;

            res.status(200).json({
                success: true,
                likes: likes
            });
        });
    });

    module.exports = router;