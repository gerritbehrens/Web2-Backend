var userService = require('../user/UserService')
var config = require("config")
var jwt = require('jsonwebtoken')
var axios = require('axios');
const User = require('../user/UserModel');

function createSessionToken(props, callback) {
    console.log("AuthentificationService: create token")

    if (!props) {
        console.log("Error: have no json body")
        callback("JSON-Body missing", null, null)
        return
    }

    userService.searchUser(props.userID, function (err, user) {
        console.log("I am searching a user to authenticate")
        if (user) {
            console.log("Found user, check password!")

            user.comparePassword(props.password, function (err, isMatch) {
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
                        let token = jwt.sign({ "user": user.userID }, privateKey, { expiresIn: expiresAt, algorithm: 'HS256' })

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

function authenticate(userID, password, callback) {
    userService.searchUser(userID, function (err, user) {
        console.log("I am searching a user to authenticate")

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
                        let token = jwt.sign({ "user": user.userID, "username": user.userName, "isAdministrator": user.isAdministrator }, privateKey, { expiresIn: expiresAt, algorithm: 'HS256' })

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
    createSessionToken,
    authenticate
}