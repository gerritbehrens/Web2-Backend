var express = require('express');
var router = express.Router();

var authenticationService = require('./AuthenticationService')

router.post('/login', function (req, res, next) {
    console.log('Want to create token.')

    authenticationService.createSessionToken(req.body, function (err, token, user) {
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
            res.status(500).json("Could not create token.")
        }
    })
})

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
    // if (!user) {
    //     return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    // }


    // if (req.headers.authorization) {
    //     authenticationService.basicAuth(req.headers.authorization, function (err, result) {
    //         if (result) {
    //             res.status(200).json({ 'Success': result })
    //         }
    //         else {
    //             res.status(401).json({ 'Error': err })
    //         }
    //     })
    //     console.log(req.headers.authorization)
    // }
// }
    // authenticationService.basicAuth(req, function(err, result){
    //     if(result){
    //         res.status(200).json(result)
    //     }
    //     else{
    //         res.status(400).json( {"Error ":err} )
    //     }
    // })
})

module.exports = router;