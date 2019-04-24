const router = require('express').Router();
const Post = require('../models/post');
const checkJwt = require('../middlewares/check-jwt');
const async = require('async');

router.route('/posts')
    .post(checkJwt, (req, res) => {
        let post = new Post();
        if (req.body.post) post.post = req.body.post;
        post.owner = req.decoded.user.id;
        post.save();
        res.status(200).json({
            success: true,
            message: 'Post successfully created'
        });
    })
    .get(checkJwt, (req, res) => {
        const perPage = 10;
        const pageNumber = req.query.page;

        async.parallel([
            function (callback) {
                Post.find({})
                .skip(pageNumber * perPage)
                .limit(perPage)
                .sort({createdAt: -1})
                .populate('comments')
                .populate('likes')
                .exec((err, posts) => {
                    callback(err, posts)
                });
            },
            function (callback) {
                Post.count({}, (err, count) => {
                    callback(err, count)
                });
            }
        ], function (err, results) {
            if (err) return err;

            let posts = resuts[0];
            let postCount = results[1];
            let totalPages = Math.ceil(postCount / perPage);
            res.status(200).json({
                success: true,
                posts: posts,
                totalPosts: postCount,
                totalPages: totalPages
            });
        });
    });

    router.get('/mypost', checkJwt, (req, res) => {
        const perPage = 10;
        const pageNumber = req.query.page;
        async.parallel([
            function (callback) {
                Post.find({owner: req.decoded.user._id})
                .skip(pageNumber * perPage)
                .limit(perPage)
                .sort({createdAt: -1})
                .populate('comments')
                .populate('likes')
                .exec((err, posts) => {
                    callback(err, posts)
                });
            },
            function (callback) {
                Post.count({owner: req.decoded.user._id}, (err, count) => {
                    callback(err, count);
                })
            }
        ], function (err, results) {
            if (err) return err;
            
            let posts = resuts[0];
            let postCount = results[1];
            let totalPages = Math.ceil(postCount / perPage);
            res.status(200).json({
                success: true,
                posts: posts,
                totalPosts: postCount,
                totalPages: totalPages
            });
        })
        
    });


module.exports = router;