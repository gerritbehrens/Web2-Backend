var mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    id: Number,
    userID: { type: String, unique: true},
    userName: String,
    password: String,
    isAdministrator: { type: Boolean, default: false}
}, {timestamps: true}
);

const User = mongoose.model("User", UserSchema);

module.exports = User;