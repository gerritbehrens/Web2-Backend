var mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    forumThreadID: { type: String, unique: true},
    title: String,
    text: String,
    authorID: { type: String, unique: true}
})

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;