const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');

router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, userExist) => {
        if (err) return err;

        if (userExist) {
            let validatePassword = userExist.comparePassword(req.body.password);
            if (validatePassword) {
                const token = jwt.sign({user: userExist}, config.secret, {expiresIn: '7d'});
                res.json({
                    success: true,
                    message: 'Login successful',
                    token: token
                })
            } else {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong user password'
                })
            }
        } else {
            res.json({
                success: false,
                message: 'Authentication failed. Wrong user email'
            })
        }
    })
});

router.post('/register', (req, res) => {
    let user = new User();
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;
    if (req.body.username) user.username = req.body.username;

    User.findOne({email: req.body.email}, (err, userExist) => {
        if (err) return err;
        if (userExist) {
            res.json({
                success: false,
                message: ' Sorry, a user with that email already exist. Try another email.'
            })
        } else {
            user.save();
            const token = jwt.sign({user: user}, config.secret, {expiresIn: '7d'})
            res.json({
                success: true,
                message: 'Registration successsful',
                token: token
            });
        }
    })
});

module.exports = router;