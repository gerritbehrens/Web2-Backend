const Message = require('./ForumMessageModel')

function setMessage(req, userID, callback){
    const msg = new Message({
        forumThreadID: req.body.forumThreadID,
        title: req.body.title,
        text: req.body.text,
        authorID: userID
    });

    msg.save(function (err, result) {
        if (result) {
            return callback(null, result)
        }
        else {
            return callback(err, null);
        }
    });
}

module.exports = {
    setMessage
}