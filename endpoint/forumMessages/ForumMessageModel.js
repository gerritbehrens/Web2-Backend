var mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    forumThreadID: { type: String, required: true },
    title: String,
    text: String,
    authorID: { type: String, required: true}
})

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;