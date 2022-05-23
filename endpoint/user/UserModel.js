var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    id: Number,
    userID: { type: String, unique: true },
    userName: String,
    password: String,
    isAdministrator: { type: Boolean, default: false }
}, { timestamps: true }
);

UserSchema.pre('save', function (next) {

    var user = this;

    console.log("Pre save: " + this.password + " change: " + this.isModified('password'));

    if (!user.isModified('password')) return next()
    bcrypt.hash(user.password, 10).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    })
}, function (err) {
    next(err);
})

UserSchema.methods.comparePassword = function (candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err)
            return next(err);
        else
            next(null, isMatch);
    })
}

const User = mongoose.model("User", UserSchema);

module.exports = User;