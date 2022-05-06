const Forum = require("./ForumThreadsModel");

var userService = require('../user/UserService')

function getForums(callback){
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
function setForum(req, callback) {
    validForumCreate(req, function (err, result) {
        if (result) {
            const user = new User({
                userID: req.body.userID.trim(),
                userName: req.body.userName,
                password: req.body.password,
                isAdministrator: req.body.isAdministrator
            });
            user.save(function (err, result) {
                return callback(err, result)
            });
        }
        else {
            return callback(err, null);
        }
    })
}

function validForumCreate(req, callback){
    
    
    if(result){
        if(req.body.name == null || req.body.userID.trim().length == 0) return callback("Forum-Name is required to create a forumthread.", null); 
    }
    
}

module.exports = {
    getForums,
    setForum
}
    