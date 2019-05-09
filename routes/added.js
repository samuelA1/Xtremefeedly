const router = require('express').Router();
const Comments = require('../models/comments');
const Post = require('../models/post');
const async = require('async');
const checkJwt = require('../middlewares/check-jwt');
const _ = require('lodash');

router.route('/likes/:id')
    .post(checkJwt, (req, res) => {

        Post.findById(req.params.id, (err, post) => {
            if (err) return err;

            post.likes.push(req.decoded.user._id);
            post.totalLikes++
            post.save();
            res.status(200).json({
                success: true,
                message: 'You liked a post' 
            });
        })
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
        
        Post.findById(postId, (err, post) => {
            if (err) return err;

            let comments = new Comments();
            comments.owner = req.decoded.user._id;
            comments.comment = req.body.comment;
            post.comments.push({comment: comments._id, commentOwner: req.decoded.user._id});
            comments.save();
            post.save();
            res.status(200).json({
                success: true,
                message: 'You commented on a post' 
            });
        })
    })
    .get(checkJwt, (req, res) => {
        const postId = req.params.id;
        Post.findById(postId)
        .select('comments')
        .populate('comments.comment')
        .populate('comments.commentOwner')
        .exec((err, comments) => {
            if (err) return err;

            res.status(200).json({
                success: true,
                comments: comments
            });
        });
    });

    router.post('/removeLike/:id',checkJwt, (req, res, next) => {
        const postId = req.params.id;
        const userId = req.decoded.user._id;
        Post.findById(postId, (err, post) => {
            if (err) return err;

            const index = post.likes.indexOf(userId);
            post.likes.splice(index, 1);
            post.totalLikes--
            post.save();
            res.json({
                success: true,
                message: "You unliked a post"
            });
        });
    });

    router.delete('/deleteComment/:id', checkJwt, (req, res) => {
        const postId = req.params.id;
        const commentId = req.query.comment;
        async.waterfall([
            function (callback) {
                Post.findOne({_id: postId}, (err, post) => {
                    if (err) return err;

                    const commentIndex = _.findIndex(post.comments, function(o) { return o._id == commentId; });
                    post.comments.splice(commentIndex, 1);
                    console.log(commentIndex)
                    callback(err, post)
                });
            },
            function (post) {
                Comments.findByIdAndRemove(commentId, (err) => {
                    if (err) return err;

                    post.save();
                    res.json({
                        success: true,
                        message: 'Comment successfully deleted'
                    });
                });
            }
        ]);
    });

    module.exports = router;