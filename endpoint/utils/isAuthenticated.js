const jwt = require('jsonwebtoken')
var config = require("config");
var userService = require("../user/UserService")

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

            userService.searchUser(userID, function (err, user) {
                if (user) {
                    next()
                }
                if (err) {
                    res.status(404).json({ "Error": "User '" + userID + "' does not exist" })
                }
            })

        }
        else {
            res.status(401).json({ "Error": "Not Authorized" })
        }
    }
    else {
        res.status(401).json({ "Error": "Authorization header is missing" })
    }

}

module.exports = {
    isAuthenticated
}