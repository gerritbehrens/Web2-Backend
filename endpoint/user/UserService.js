const req = require("express/lib/request");
const res = require("express/lib/response");
const { where } = require("./UserModel");
const User = require("./UserModel");

function getUsers(callback){
    User.find(function(err, users)
    {
        if(err)
        {
            console.log("Error by searching users!")
            return callback(err, null);
        }
        else{
            console.log("Got all users.");
            return callback(null, users);
        }
    })
}

function searchUser(searchItem, callback){
    getUsers(function(err, result){
        if(result){

            let found = result.find(element => element.userID === searchItem)
            if(found === null){
                return callback("The user: '" + searchItem + "' does not exist", null);
            }
            else{
                return callback(null, found);
            }
        }
        
    })
   
}

function setUser(req, callback){
    validUserCreate(req, function(err, result){
        if(err == null){
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
            return callback(true, result);
        }
    })
}

function updateUser(req, updateItem, callback){
    searchUser(updateItem, function(err, result){
        if(err == null && result){

            console.log("Update procedure")

            User.findOneAndUpdate( { userID: updateItem }, req.body, null, function(err, result) {
                if(err){
                    callback(err, null );
                }
                else{
                    callback(null, result)
                }
            })
        }
    })
}

function deleteUser(deleteItem, callback){
    if(!deleteItem){
        callback("UserID is missing")
    }
    else{
        User.deleteOne({ userID: deleteItem}, null, (err, result) => {
            if(err){
                callback(err, null);
            }
            else{
                callback(null, result.deleteCount);
            }
        })
    }
}

function validUserCreate(req, callback){
    getUsers(function(err, result){
        if(result)
        {   
            if(req.body.userID == null) return callback(true, "Error: UserID required - No Key Exception");
            if(result.length > 0){
                let found = result.find(element => element.userID === req.body.userID)
                if(found == null){
                    return callback(null, true);
                }
                else{
                    return callback(true, "Error: Can not create User - Dobble Key Exception");
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