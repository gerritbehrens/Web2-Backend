const Forum = require("./ForumThreadsModel");

function getForums(callback) {
    Forum.find(function (err, result) {
        if (result) {
            return callback(null, result);
        }
        else {
            return callback(err, null);

        }
    })
}

/* Creates a user-entity */
function setForum(req, ownerID, callback) {
    const forum = new Forum({
        name: req.body.name,
        describtion: req.body.describtion,
        ownerID: ownerID
    });

    forum.save(function (err, result) {
        if (result) {
            return callback(err, result)
        }
        else {
            return callback(err, null);
        }
    });
}

function searchForumsFromUser(req, ownerID, callback) {
    console.log(ownerID)
    Forum.find((err, result) => {
        if (result.length != 0) {
            let forumFromUser = []
            result.forEach(element => {
                if (element.ownerID == ownerID) {
                    forumFromUser.push(element)
                }
            });
            return callback(null, forumFromUser)
        }
        else {
            return callback("No Forums found here", null)
        }
    })
}

function searchForumsFromID(req, threadID, callback) {
    console.log(threadID)
    getForums((err, result) => {
        if (result.length > 0) {
            let forum
            result.forEach(element => {
                if (element._id == threadID) {
                    forum = element

                }
            });
            return callback(null, forum)
        }
        else {
            console.log("Forum is isEmpty")
            return callback({ "Error": "No Forum found with this ID" }, null)
        }
    });
}

function updateForum(req, threadID, changeReqUserID, callback) {
    //Search forum --> If exitst go on || else throw err
    searchForumsFromID(req, threadID, (err, result) => {
        if (result) {
            if (result.ownerID === changeReqUserID) {
                var query = Forum.findOne({ _id: threadID })
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
                return callback({ "Error": "User is not allowed to perform this action" }, null)
            }

        }
        else {
            return callback({ "Error": "Forum does not exist" }, null)
        }
    })
}

function deleteForum(req, threadID, changeReqUserID, callback) {
    //Search forum --> If exitst go on || else throw err
    searchForumsFromID(req, threadID,  (err, result) => {
        if (result) {
            if (result.ownerID === changeReqUserID) {
                Forum.deleteOne({ _id: threadID }, null, (err, result) => {
                    if (result) {
                        return callback(null, result)
                    }
                    else {
                        return callbak(err, null)
                    }
                })
            }
            else{
                return callback( {"Error": "User is not allowed to perform this action"}, null)
            }

        }
        else {
            return callback({ "Error": "Forum does not exist" }, null)
        }
    })
}

module.exports = {
    getForums,
    setForum,
    searchForumsFromUser,
    searchForumsFromID,
    updateForum,
    deleteForum
}
