var userService = require('../user/UserService')
var config = require("config")
var jwt = require('jsonwebtoken')
var axios = require('axios');

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

function basicAuth(props, callback) {
    
    axios.get('http://localhost:8080')
        .then(response => {
            console.log(response.data.url);
        })
        .catch(error => {
            var authenticationValue = error.response.headers['www-authenticate'];
            console.log("Authenticate? " + authenticationValue);
        });

}

module.exports = {
    createSessionToken,
    basicAuth
}