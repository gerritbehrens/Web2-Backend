var express = require('express');
var publicRouter = express.Router();

var userService = require("./UserService")

//Get all users in one output (JSON)
publicRouter.get('/', function(req,res){
    userService.getUsers(function(err, result){
        if(result)
        {
            res.status(200).json(result);
        }
        else{
            res.status(500).json("Error while searching for users");
        }
    })
}
)

//Add a user to the database
publicRouter.post("/", (req, res) => {

    userService.setUser(req, function(err,result){
        
        if(result)
        {
            res.status(200).json(result);
        }
        else if(err){
            res.status(409).json({ "Error ": err});
        }
        else{
            res.status(500).json({"Error ": err});
        }
    })  
})

//Get the user by it's userID (Searching for specific user)
publicRouter.get('/:id', (req,res) => {

    let splitArr = req.originalUrl.split("/");

    let searchItem = splitArr[splitArr.length-1];

    userService.searchUser(searchItem, function(err, result){
        
        if(result)
        {
            res.status(200).json(result);
        }
        else{
            res.status(404).json({"Error ":err });
        }
    })
})

publicRouter.put("/:id", (req, res) => {

    let splitArr = req.originalUrl.split("/");
    
    let updateItem = splitArr[splitArr.length-1];

    userService.updateUser(req, updateItem, function(err, result){
        if(result){
            res.status(200).json(result)//{ "Success": "User '" + updateItem + "' was updated!"});
        }  
        else{
            res.status(404).json({ "Error": "User '" + updateItem + "' was not found!"});
        }
            
    })
})

publicRouter.delete("/:id", (req,res) => {
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

module.exports = publicRouter;