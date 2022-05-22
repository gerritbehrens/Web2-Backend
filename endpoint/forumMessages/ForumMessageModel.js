var mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    forumThreadID: String,
    title: String,
    text: String,
    authorID: String
})

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;