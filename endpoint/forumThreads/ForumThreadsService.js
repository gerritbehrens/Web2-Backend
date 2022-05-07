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

function searchForumsFromUser(req, userID, callback){
    Forum.find( (err, result) => {
        if(result.length != 0){
            let forumFromUser = []
            result.forEach(element => {
                if(element.ownerID == userID){
                    forumFromUser.push(element)
                }
            });
            return callback(null, forumFromUser)
        }
        else{
            return callback("No Forums found here!", null)
        }
    })
}

module.exports = {
    getForums,
    setForum,
    searchForumsFromUser
}
