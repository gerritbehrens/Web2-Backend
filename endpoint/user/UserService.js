const User = require("./UserModel");
const jwt = require('jsonwebtoken')
var config = require("config");

/* Get's all userser in the db */
function getUsers(callback) {
    User.find(function (err, result) {
        if (result) {
            return callback(null, result);
        }
        else {
            return callback(err, null);

        }
    })
}

/* Searches for a spezific user in the db */
function searchUser(searchItem, callback) {
    getUsers(function (err, result) {
        if (result) {
            let found = result.find(element => element.userID === searchItem)

            if (found == null) {
                if (found == null && searchItem == "admin") {
                    console.log("Do not have admin account yet. Create it with default password")
                    var adminUser = new User();
                    adminUser.userID = "admin"
                    adminUser.password = "123"
                    adminUser.userName = "Default Administrator Account"
                    adminUser.isAdministrator = true

                    adminUser.save(function (err) {
                        if (err) {
                            console.log("Could not create default admin account: " + err)
                            return callback("Could not create default admin account", null)
                        }
                        else {
                            callback(null, adminUser)
                        }
                    })
                }
                else {
                    return callback("The user '" + searchItem + "' was not found", null);

                }
            }
            else {

                return callback(null, found);


            }
        }

    })

}

/* Creates a user-entity */
function setUser(req, callback) {
    console.log(req.body)
    validUserCreate(req, function (err, result) {
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

/* Updates a value in the user-entity */
function updateUser(req, updateItem, callback) {
    searchUser(updateItem, function (err, result) {
        if (result) {
            var query = User.findOne({ userID: updateItem })
            query.exec(function (err, result) {
                if (result) {
                    Object.assign(result, req.body)
                    result.save(function (err, result) {
                        return callback(null, result)
                    })
                }
            })
        }
        else {
            return callback(err, null)
        }
    })
}

/* Deletes a specific user from the db */
function deleteUser(deleteItem, callback) {

    User.deleteOne({ userID: deleteItem }, null, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        else {
            return callback(null, result.deletedCount);
        }
    })
}

/* Validates if a user is allowed to be created */
function validUserCreate(req, callback) {
    getUsers(function (err, result) {

        if (result) {
            if (req.body.userID == null || req.body.userID.trim().length == 0) return callback("UserID required to create a valid user", null);

            if (result.length > 0) {
                let found = result.find(element => element.userID === req.body.userID.trim())
                if (found == null) {
                    return callback(null, true);
                }
                else {
                    return callback("Can not create two users with the same userID", null);
                }
            }
            else {
                return callback(null, true);
            }
        }
    })
}

//Middleware - authorized
function isAuthenticated(req, res, next) {
    //Does header exist or is it missing
    if (req.headers.authorization) {
        
        var token = req.headers.authorization.split(" ")[1]
        //Test if token could be a possible Token
        if(token == null){
            console.log("Token invalid")
            res.status(401).json({"Error":"Token invalid"})
            return
        } 
        //If Token candidate could be valid --> verify via JWT
        if (jwt.verify(token, config.get('session.tokenKey'))) {
            console.log("Token valid")

            const base64Credentials = req.headers.authorization.split('.')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
            const [ID] = credentials.split(',');

            const userID = ID.split(':')[1].split('"')[1]

            searchUser(userID, function (err, user) {
                if (user) {
                    next()
                }
                if (err) {
                    console.log("Throwing Not Authorized becasue User does not Exist")
                    res.status(404).json({ "Error": "User does in req does not exist" })
                }
            })

        }
        else {
            res.status(401).json({ "Error": "Not Authorized" })
        }
    }
    else {
        res.status(400).json({ "Error": "Authorization header is missing" })
    }

}
//Middleware - Validation of the request via the token 
function isAdmin(req, res, next) {


    if (req.headers.authorization) {
        //Decode and split Base64
        const base64Credentials = req.headers.authorization.split('.')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [ID, name, isAdmin] = credentials.split(',');

        //Extract userID- and isAdministrator-Value
        const isAdministrator = isAdmin.split(':')[1]
        const userID = ID.split(':')[1].split('"')[1]


        searchUser(userID, function (err, user) {
            //if user exists in Database and is Administrator show all users
            if (user) {
                if (isAdministrator.match("true")) {
                    console.log("The user is Administrator")
                    next()
                }
                else {
                    res.status(401).json({ "Error": "Not Authorized" })
                }
            }
        })
    }
    else {
        res.status(400).json({ "Error": "Authorization header is missing" })
    }
}

module.exports = {
    getUsers,
    setUser,
    searchUser,
    updateUser,
    deleteUser,
    isAdmin,
    isAuthenticated
}