var express = require('express')
var router = express.Router();

var userService = require("./UserService")

//Get all users in the database
router.get('/', userService.isAuthenticated, userService.isAdmin,  (req, res, next) => {
    console.log("DA DARF ER NICHTMAL HINKOMMEN!!! In Get all users in UserRoute")
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
        else if(err) {
            res.status(500).json({ "Error": "There was a problem by perfoming this taks." });
        }
    })
})

//Add a user to the database
router.post("/", userService.isAuthenticated, userService.isAdmin, (req, res) => {
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
router.get("/:userID", userService.isAuthenticated, userService.isAdmin, (req, res) => {

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

router.delete("/:userID", userService.isAuthenticated, userService.isAdmin, (req, res) => {

    let splitArr = req.originalUrl.split("/");

    let deleteItem = splitArr[splitArr.length-1];

    userService.deleteUser(deleteItem, function(err,result){
        
        if(result)
        {
            res.status(204).json()
        }
        else{
            res.status(500).json({"Error ": err});
        }
    })  
})

router.put("/:id", userService.isAuthenticated, userService.isAdmin, (req, res) => {

    let splitArr = req.originalUrl.split("/");
    
    let updateItem = splitArr[splitArr.length-1];

    userService.updateUser(req, updateItem, function(err, result){
        if(result){
            const { id, userID, userName, isAdministrator, ...partialObject } = result
                    const subset = {userID, userName, isAdministrator }
                    console.log(JSON.stringify(subset))
                    res.status(200).json(subset)
        }  
        else{
            res.status(404).json({ "Error": "User '" + updateItem + "' was not found!"});
        }
            
    })
})



module.exports = router;