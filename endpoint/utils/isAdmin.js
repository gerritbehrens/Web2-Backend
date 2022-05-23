var userService = require("../user/UserService")

//Middleware - Validation of the request via the token 
function isAdmin(req, res, next) {


    if (req.headers.authorization) {
        //Decode and split Base64
        const base64Credentials = req.headers.authorization.split('.')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [ID, name, isAdmin] = credentials.split(',');

        //Extract userID- and isAdministrator-Value
        const isAdministrator = isAdmin.split(':')[1]
        const userID = ID.split(':')[1].split('"')[1]


        userService.searchUser(userID, function (err, user) {
            //if user exists in Database and is Administrator show all users
            if (user) {
                if (isAdministrator.match("true")) {
                    next()
                }
                else {
                    res.status(401).json({ "Error": "Not Authorized" })
                }
            }
        })
    }
    else {
        res.status(400).json({ "Error": "Authorization header is missing" })
    }
}

module.exports = {
    isAdmin
}