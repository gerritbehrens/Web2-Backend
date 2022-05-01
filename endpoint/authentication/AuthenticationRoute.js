var express = require('express');
var router = express.Router();

var authenticationService = require('./AuthenticationService')

router.post('/login', function(req, res, next){
    console.log('Want to create token.')

    authenticationService.createSessionToken(req.body, function(err, token, user){
        if(token){
            res.header("Authorization", "Bearer " + token)

            if(user){
                const {id, userID, userName, ...partialObject} = user
                const subset = { id, userID, userName }
                console.log(JSON.stringify(subset))
                res.status(200).json(subset)
            }
            else{
                console.log("User is null, even though a token has been created. Error: " + err)
                res.status(404).json("User could not be found, even though a toekn has been created. Error: " + err)
            }
        }
        else{
            console.log("Token has not been created, Error: " + err)
            res.status(500).json("Could not create token.")
        }
    })
})

router.get('/', function(req, res, next){
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        return res.json({ message: 'Missing Authorization Header Gib die daten' });
        }
    authenticationService.basicAuth(req, function(err, result){
        if(result){
            res.status(200).json(result)
        }
        else{
            res.status(400).json( {"Error ":err} )
        }
    })
})

module.exports = router;