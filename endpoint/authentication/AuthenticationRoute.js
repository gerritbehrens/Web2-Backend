var express = require('express');
var router = express.Router();

var authenticationService = require('./AuthenticationService')

router.get('/', function (req, res, next) {

    if (req.headers.authorization.length != 0) {
        //Decode and split Base64
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [userID, password] = credentials.split(':');

        authenticationService.authenticate(userID, password, function (err, token, user) {
            if (token) {
                res.header("Authorization", "Bearer " + token)

                if (user) {
                    res.status(200).json( {"Success": "Token created successfully"} )
                }
                else {
                    console.log("User is null, even though a token has been created. Error: " + err)
                    res.status(404).json("User could not be found, even though a toekn has been created. Error: " + err)
                }
            }
            else {
                console.log("Token has not been created, Error: " + err)
                res.status(401).json({ "Error": "Failed to create token" })
            }
        })
    }
    else{
        res.status(400).json( { "Error": "Request header for authentication is missing"})
    }
})

module.exports = router;