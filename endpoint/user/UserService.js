const req = require("express/lib/request");
const res = require("express/lib/response");
const User = require("./UserModel");

let n = 0;

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

function searchUser(req, callback){

    validUser(req, function(err, result){
        if(err === true && result === User){
            return callback(null, result);
        }
    })
    /* getUsers(function(err, result){
        if(result){
            var usersArr = Object.values(result);
    
            usersArr.forEach(element => {
                if(element.userID == req.userID){
                    return callback(null, element);
                }
            });
        }
        else{
            return callback(true, null);
        }
    }) */
    
}

function setUser(req, callback){
    validUser(req, function(err, result){
        if(err == null){
            console.log("User can be created!")
            const user = new User({
                id: n,
                userID: req.body.userID,
                userName: req.body.userName,
                password: req.body.password,
                isAdministrator: req.body.isAdministrator
            });
            n++;
            user.save();
            return callback(null, user);
        }
        else{
            console.log("User already exists")
            return callback(null, null);
        }
    })
}

function validUser(req, callback){
    getUsers(function(err, result){
        if(result)
        {
            /* var usersArr = result */;
            
            if(result.length > 0){
                console.log("Array includes Users")

                var found = result.find(element => element.userID === req.body.userID)
                if(found == null){
                    return callback(null, true);
                }
                else{
                    return callback(true, null);
                }


                /* result.forEach(element => {
                    var elementUserID = element.userID;
                    
                    console.log("Element in Schleife: " + element.userID)
                    console.log("Hinzuzufügendes Element: " + req.body.userID)

                    
                    if(elementUserID === req.body.userID){
                        console.log("Ich bin in der VergleichOP")
                        return callback(true, element);
                    }
                    
                }); */
                //return callback(true, null);
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
    searchUser
    /* getPublicUsers */
}