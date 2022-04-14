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
    newUser = new User;
    return callback(null, newUser);
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