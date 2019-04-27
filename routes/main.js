const router = require('express').Router();
const Likes = require('../models/likes');
const Comments = require('../models/comments');
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

                    post.likes.push(likes._id);
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

    router.route('/comments/:id')
    .post(checkJwt, (req, res) => {
        const postId = req.params.id;
        async.waterfall([
            function (callback) {
                let comments = new Comments();
                comments.owner = req.decoded.user._id;
                comments.comment = req.body.comment;
                callback(err, comments)
            }, 
            function (comments) {
                Post.findById(postId, (err, post) => {
                    if (err) return err;

                    post.comments.push(comments._id);
                    comments.save();
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
        .select('comments')
        .populate('comments')
        .exec((err, comments) => {
            if (err) return err;

            res.status(200).json({
                success: true,
                comments: comments
            });
        });
    });

    module.exports = router;