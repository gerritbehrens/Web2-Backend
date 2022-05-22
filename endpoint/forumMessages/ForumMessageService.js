const res = require('express/lib/response');
const Message = require('./ForumMessageModel')

function setMessage(req, userID, callback) {
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

function getMessages(forumThreadID, callback) {
    Message.find({ forumThreadID: forumThreadID }, (err, msgs) => {
        if (msgs) {
            return callback(null, msgs)
        }
        else {
            return callback({ "Error": "Internal Server Error" }, null)
        }
    })
}

function deleteMessage(messageID, userID, isAdministrator, callback) {
    Message.find({ _id: messageID }), (err, result) => {
        console.log("I am in deleteMessage")
        if (result) {
            console.log("Message does exist")
            if (result.authorID === userID || isAdministrator == "true") {
                Message.deleteOne({ _id: messageID }, null, (err, result) => {
                    if (result) {
                        return callback(null, result)
                    }
                    else {
                        return callback(err, null)
                    }
                })
            }
            

        }else{
                res.status(404).json({"Error":"Message does not exist!"}, null)
            }
    }
}

module.exports = {
    setMessage,
    getMessages,
    deleteMessage
}