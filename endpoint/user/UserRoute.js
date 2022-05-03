var express = require('express')
var router = express.Router();

var userService = require("./UserService")

//Get all users in the database
router.get('/', validAndIsAdmin, function (req, res, next) {
    userService.getUsers(function (err, user) {
        if (user) {
            var resultBuffer = [];

            user.forEach(element => {
                const { id, userID, userName, isAdministrator, ...partialObject } = element
                const subset = { userID, userName, isAdministrator }
                resultBuffer.push(subset)
            });
            console.log(JSON.stringify(resultBuffer))
            res.status(200).json(resultBuffer)
        }
        else {
            res.status(500).json({ "Error": "There was a problem by perfoming this taks." });
        }
    })
})

//Add a user to the database
router.post("/", validAndIsAdmin, (req, res) => {
    userService.setUser(req, function(err,result){
        
        if(result)
        {
            const { id, userID, userName, isAdministrator, ...partialObject } = result
                    const subset = {userID, userName, isAdministrator }
                    console.log(JSON.stringify(subset))
                    res.status(201).json(subset)
        }
        else if(err){
            res.status(409).json({ "Error ": err});
        }
        else{
            res.status(500).json({"Error ": err});
        }
    })  
})

//Add a user to the database
router.get("/:userID", validAndIsAdmin, (req, res) => {

    let splitArr = req.originalUrl.split("/");

    let searchItem = splitArr[splitArr.length-1];

    userService.searchUser(searchItem, function(err,result){
        
        if(result)
        {
            const { id, userID, userName, isAdministrator, ...partialObject } = result
                    const subset = {userID, userName, isAdministrator }
                    console.log(JSON.stringify(subset))
                    res.status(200).json(subset)
        }
        else if(err){
            res.status(404).json({ "Error ": err});
        }
        else{
            res.status(500).json({"Error ": err});
        }
    })  
})

//Middleware - Validation of the request via the token 
function validAndIsAdmin(req, res, next) {


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
                    console.log("The user is Administrator")
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

module.exports = router;