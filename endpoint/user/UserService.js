const User = require("./UserModel");
const jwt = require('jsonwebtoken')
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

module.exports = {
    getUsers,
    setUser,
    searchUser,
    updateUser,
    deleteUser,
}