const User = require("./UserModel");

/* Get's all userser in the db */
function getUsers(callback){
    User.find(function(err, result)
    {
        if(result)
        {
            return callback(null, result);
        }
        else{
            return callback(err, null);
            
        }
    })
}

/* Searches for a spezific user in the db */
function searchUser(searchItem, callback){
    getUsers(function(err, result){
        if(result){

            let found = result.find(element => element.userID === searchItem)

                if(found == null){
                    return callback("The user '" + searchItem + "' was not found", null);
                }
                else{
                    return callback(null, found);
                }
        }
        
    })
   
}

/* Creates a user-entity */
function setUser(req, callback){
    validUserCreate(req, function(err, result){
        if(result){
            const user = new User({
                userID: req.body.userID,
                userName: req.body.userName,
                password: req.body.password,
                isAdministrator: req.body.isAdministrator
            });
            user.save();
            return callback(null, user);
        }
        else{
            return callback(err, null);
        }
    })
}

/* Updates a value in the user-entity */
function updateUser(req, updateItem, callback){
    searchUser(updateItem, function(err, result){
        if(result){


            User.findOneAndUpdate( { userID: updateItem }, req.body, null, function(err, result) {
                if(err){
                    callback(err, null );
                }
                else{
                    callback(null, result)
                }
            })
        }
        else{
            callback(err, null)
        }
    })
}

/* Deletes a specific user from the db */
function deleteUser(deleteItem, callback){
    
        User.deleteOne({ userID: deleteItem}, null, (err, result) => {
            if(err){
                callback(err, null);
            }
            else{
                callback(null, result.deletedCount);
            }
        })
}

/* Validates if a user is allowed to be created */
function validUserCreate(req, callback){
    getUsers(function(err, result){
        if(result)
        {   
            if(req.body.userID == null) return callback("UserID required to create a valid user", null);
            
            if(result.length > 0){
                let found = result.find(element => element.userID === req.body.userID)
                if(found == null){
                    if(req.body.userName == null) return callback("User name required to create a valid user", null);
                    if(req.body.password == null) return callback("Password required to create a valid user", null);
                    return callback(null, true);
                }
                else{
                    return callback("Can not create two users with the same userID", null);
                }
            }
            else{
                return callback(null, true);
            }
        }
    })
}

module.exports = {
    getUsers,
    setUser,
    searchUser,
    updateUser,
    deleteUser
}