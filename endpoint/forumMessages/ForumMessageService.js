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

function getMessages(forumThreadIDSearch, callback) {
    if (forumThreadIDSearch == "all") {
        Message.find((err, msgs) => {
            if (msgs) {
                return callback(null, msgs)
            }
            else if (err) {
                return callback("Internal Server Error", null)
            }
        })
    }
    else {
        Message.find({ forumThreadID: forumThreadIDSearch._id }, (err, msgs) => {
            if (msgs) {
                return callback(null, msgs)
            }
            else if (err) {
                return callback("Internal Server Error", null)
            }
        })
    }
}

function updateMessage(req, messageID, changeReqUserID, isAdministrator, callback) {
    //Search Message --> If exitst go on || else throw err
    Message.find({ _id: messageID }, (err, result) => {
        if (result) {
            if (result.authorID === changeReqUserID || isAdministrator == "true") {
                var query = Message.findOne({ _id: messageID })
                query.exec((err, result) => {
                    if (result) {
                        Object.assign(result, req.body)
                        result.save((err, result) => {
                            return callback(null, result)
                        })
                    }
                })
            }
            else {
                return callback({ "Error": "Not Authorized" }, "Not Authorized")
            }
        }
        else {
            return callback({ "Error": "Forum does not exist" }, null)
        }
    })
}

function deleteMessage(messageID, changeReqUserID, isAdministrator, callback) {
    //Search Message --> If exitst go on || else throw err
    Message.find({ _id: messageID }, (err, result) => {
        if (result && result.length != 0) {
            if (result.authorID === changeReqUserID || isAdministrator == "true") {
                Message.deleteOne({ _id: messageID }, null, (err, result) => {
                    if (result) {
                        return callback(null, result)
                    }
                    else if (err) {
                        return callback(err, null)
                    }
                })
            }
            else {
                return callback({ "Error": "Not Authorized" }, "Not Authorized")
            }
        }
        else if (err) {
            return callback({ "Error": "Message does not exist" }, null)
        }
    })
}

module.exports = {
    setMessage,
    getMessages,
    deleteMessage,
    updateMessage
}