const router = require('express').Router();
const Post = require('../models/post');
const checkJwt = require('../middlewares/check-jwt');
const async = require('async');
const cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'daydy3tvk', 
    api_key: '555951259724868', 
    api_secret: '9-IvSbBzpa9hFXsUkwB8qG_IXd8' 
});



router.route('/posts')
    .post(checkJwt, (req, res) => {
        let post = new Post();
        if (req.body.post) post.post = req.body.post;
        if (req.body.image) {
            cloudinary.uploader.upload(req.body.image, (err, result) => {
                if (err) return err;

                post.imgVersion = result.version;
                post.imgId = result.public_id;
            });
        }
        post.owner = req.decoded.user._id;
        post.save();
        console.log(req.decoded);
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
                .populate('owner')
                .populate('likes')
                .exec((err, posts) => {
                    if (err) return err;

                    // let allPost = posts
                    // let myPosts = req.url = '/api/post/mypost'
                    callback(err, posts);
                });
            },
            function (callback) {
                Post.count({}, (err, count) => {
                    callback(err, count)
                });
            }
        ], function (err, results) {
            if (err) return err;

            let posts = results[0];
            posts.forEach(post => {
                if (post['likes']) {
                    post['likes'].forEach(like => {
                        if (like['owner']['_id'] == req.decoded.user._id) {
                            post = Object.assign(post, {
                                isLiked: true
                            })
                        } else {
                            post = Object.assign(post, {
                                isLiked: false
                            })
                        }
                    })
                }
            });
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