const { numberParser } = require('config/parser');
var mongoose = require('mongoose')

const ForumSchema = new mongoose.Schema({
    name: String,
    description: String,
    ownerID: String
})

const Forum = mongoose.model("Forum", ForumSchema);

module.exports = Forum;