const router = require('express').Router();
const Post = require('../models/post');
const checkJwt = require('../middlewares/check-jwt');

router.route('/posts')
    .post(checkJwt, (req, res) => {
        
    })
    .get(checkJwt, (req, res) => {

    })


module.exports = router;