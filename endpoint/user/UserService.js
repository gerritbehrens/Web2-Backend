const req = require("express/lib/request");
const res = require("express/lib/response");
const User = require("./UserModel");


/* const PublicUser = require("./PublicUsersRoute"); */

function getUsers(callback){
    User.find(function(err, users)
    {
        if(err)
        {
            console.log("Fehler bei Suche: " + err)
            return callback(err, null);
        }
        else{
            console.log("Alles super");
            return callback(null, users);
        }
    })
}

function setUser(callback){
    console.log("I am in setUser")

    var users = new User();

    /* console.log(req.body) */
    users.userID = req.body.userID
    /* user.userName = req.params[1]S
    user.password = req.params[2]
    user.isAdministrator = req.params[3] */
        
    return callback(null, users) ;
}   


/* function setUserID(user, newID){
    user.userID = newID;
}

function setUserName(user, newName){
    user.userName = newName;
}

function setPassword(user, newPassword){
    user.password = newPassword;
}

function setAdministrator(user, newIsAdministrator){
    user.isAdministrator = newIsAdministrator;
} */

/* function getPublicUsers(callback){
    PublicUser.find(function(err, users)
    {
        if(err)
        {
            console.log("Fehler bei Suche: " + err)
            return callback(err, null);
        }
        else{
            console.log("Alles super");
            return callback(null, users);
        }
    })
} */

module.exports = {
    getUsers,
    setUser
    /* getPublicUsers */
}