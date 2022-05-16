var express = require('express')
var router = express.Router();

var userService = require("./UserService")
var Authentification = require("../utils/isAuthenticated")
var isAdmin = require("../utils/isAdmin")

//Get all users in the database
router.get('/', Authentification.isAuthenticated, isAdmin.isAdmin,  (req, res, next) => {
    userService.getUsers(function (err, user) {
        if (user) {
            filteredUsers = user.map(function (item) {
                return { "userID": item.userID, "userName": item.userName, "isAdministrator": item.isAdministrator}
            })
            return res.status(200).json(filteredUsers)
        }
        else if(err) {
            return res.status(500).json({ "Error": "There was a problem by perfoming this taks." });
        }
    })
})

//Add a user to the database
router.post("/", Authentification.isAuthenticated, isAdmin.isAdmin, (req, res) => {
    userService.setUser(req, function(err,user){
        
        if(user)
        {
            const { id, userID, userName, isAdministrator, ...partialObject } = user
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
router.get("/:userID", Authentification.isAuthenticated, isAdmin.isAdmin, (req, res) => {

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

router.delete("/:userID", Authentification.isAuthenticated, isAdmin.isAdmin, (req, res) => {

    let splitArr = req.originalUrl.split("/");

    let deleteItem = splitArr[splitArr.length-1];

    userService.deleteUser(deleteItem, function(err, result){
        if(result === 1) {
            res.status(204).json({ "Success": "User '" + deleteItem + "' was deleted!"});
        }
        else if(!err){
            res.status(404).json({ "Error": "User '" + deleteItem + "' was not found!"});
        }
        else{
            res.status(500).json({ "Error": err });
        }
    })
})

router.put("/:id", Authentification.isAuthenticated, isAdmin.isAdmin, (req, res) => {

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