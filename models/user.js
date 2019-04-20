const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    username: {type: String, lowercase: true, unique: true, required: true},
    email: {type: String, lowercase: true, unique: true, required: true},
    password: String,
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}]
});

UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}



module.exports = mongoose.model('User', UserSchema);