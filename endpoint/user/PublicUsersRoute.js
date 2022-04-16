var express = require('express');
var publicRouter = express.Router();

var userService = require("./UserService")

//Get all users in one output (JSON)
publicRouter.get('/', function(req,res,next){
    userService.getUsers(function(err, result){
        console.log("Result: " + result);
        if(result)
        {
            res.send(Object.values(result));
        }
        else{
            res.send("Es gab Probleme");
        }
    })
}
)

//Add a user to the database
publicRouter.post("/", (req, res) => {

    userService.setUser(req, function(err,result){
        
        if(err == null && result)
        {
            console.log("Created User: " + result);
            res.send(Object.values(result));
        }
        else{
            console.log(result)
            res.send(result)
        }
    })  
})

//Get the user by it's userID (Searching for specific user)
publicRouter.get('/:id', (req,res) => {

    let splitArr = req.originalUrl.split("/");

    let searchItem = splitArr[splitArr.length-1];

    userService.searchUser(searchItem, function(err, result){
        
        if(err == null && result != null)
        {
            console.log("Result: ");
            console.log(result)
            res.send(result)
        }
        else{
            console.log("The User '" + searchItem + "' does not exist.");
            res.send("The User '" + searchItem + "' does not exist.");
        }
    })
})

publicRouter.put("/:id", (req, res) => {

    let splitArr = req.originalUrl.split("/");
    
    let updateItem = splitArr[splitArr.length-1];

    userService.updateUser(req, updateItem, function(err, result){
        if(result){
            userService.searchUser(updateItem, function(err, result){
                if(err == null && result != null)
                    {
                        console.log("Updated: ");
                        console.log(result)
                        res.send(result)
                    }
                else{
                    console.log("The User '" + searchItem + "' does not exist.");
                    res.send("The User '" + searchItem + "' does not exist.");
                }
            })
        }
        else{
            res.send(err)
        }
    })
})

publicRouter.delete("/:id", (req,res) => {
    let splitArr = req.originalUrl.split("/");
    
    let deleteItem = splitArr[splitArr.length-1];

    userService.deleteUser(deleteItem, function(err, result){
        if(result === 1) {
            res.status(200).json({ "Success": "User '" + deleteItem + "' was deleted!"});
        }
        else if(!err){
            res.status(404).json({ "Error": "User '" + deleteItem + "' was not found!"});
        }
        else{
            res.status(500).json({ "Error": err });
        }
    })
})

module.exports = publicRouter;