var userService = require('../user/UserService')
var config = require("config")
var jwt = require('jsonwebtoken')

function authenticate(userID, password, callback) {
    userService.searchUser(userID, function (err, user) {

        if (user) {
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    return callback(err, null)
                }
                else {
                    if (isMatch) {
                        var issuedAt = new Date().getTime();
                        var expirationTime = config.get('session.timeout')
                        var expiresAt = issuedAt + (expirationTime * 1000)
                        var privateKey = config.get('session.tokenKey')
                        let token = jwt.sign({ "user": user.userID, "username": user.userName, "isAdministrator": user.isAdministrator }
                            , privateKey, { expiresIn: expiresAt, algorithm: 'HS256' })

                        return callback(null, token, user)
                    }
                    else {
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