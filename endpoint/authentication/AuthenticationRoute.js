var express = require('express');
var router = express.Router();

var authenticationService = require('./AuthenticationService')

router.get('/', function (req, res, next) {
    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [userID, password] = credentials.split(':');

    authenticationService.authenticate(userID, password, function(err, token, user){
        if (token) {
            res.header("Authorization", "Bearer " + token)

            if (user) {
                const { id, userID, userName, ...partialObject } = user
                const subset = { id, userID, userName }
                console.log(JSON.stringify(subset))
                res.status(200).json(subset)
            }
            else {
                console.log("User is null, even though a token has been created. Error: " + err)
                res.status(404).json("User could not be found, even though a toekn has been created. Error: " + err)
            }
        }
        else {
            console.log("Token has not been created, Error: " + err)
            res.status(401).json( { "Error": "Could not create token." } )
        }
    })
})

module.exports = router;