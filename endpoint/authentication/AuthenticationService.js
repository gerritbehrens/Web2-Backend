var userService = require('../user/UserService')
var config = require("config")
var jwt = require('jsonwebtoken')

function authenticate(userID, password, callback) {
    userService.searchUser(userID, function (err, user) {

        if (user) {
            console.log("Found user, check password!")

            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    console.log("Password is invalid");
                    return callback(err, null)
                }
                else {
                    if (isMatch) {
                        console.log("Password is correct. Create token.")

                        var issuedAt = new Date().getTime();
                        var expirationTime = config.get('session.timeout')
                        var expiresAt = issuedAt + (expirationTime * 1000)
                        var privateKey = config.get('session.tokenKey')
                        let token = jwt.sign({ "user": user.userID, "username": user.userName, "isAdministrator": user.isAdministrator }
                            , privateKey, { expiresIn: expiresAt, algorithm: 'HS256' })

                        console.log("Token created: " + token)
                        return callback(null, token, user)
                    }
                    else {
                        console.log("Password or userID are invalid.")
                        return callback(err, null)
                    }

                }
            })
        }
        else {
            return callback(err, null)
        }
    })
}

module.exports = {
    authenticate
}