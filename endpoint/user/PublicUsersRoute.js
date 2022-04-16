var express = require('express');
const req = require('express/lib/request');
const router = require('./UserRoute');
var publicRouter = express.Router();

var userService = require("./UserService")

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

publicRouter.post("/", (req, res, next) => {

    userService.setUser(req, function(err,result){
        
        if(result)
        {
            console.log("Created User: " + result);
            res.send(Object.values(result));
        }
        else{
            console.log("Error: Can not create User - Dobble Key Exeption.")
            res.send("Error: Can not create User - Dobble Key Exeption.")
        }
    })  
})

publicRouter.get('/:id', (req,res) => {
    //res.send(`User with User-ID ${req.params.id}`)
    userService.searchUser(req, function(err, result){
        
        if(result)
        {
            console.log("Result: " + result);
            res.send(`Searched User: ${Object.values(result)}`);
        }
        else{
            console.log("User does not exist.");
            res.send(`The User ${req.body.userID} does not exist.`);
        }
    })
})

/* publicRouter
    .route("/:id")
    .get((req,res) => {
        res.send(`Get User With ID ${req.params.id}`)
    })
    .put((req, res) => {
        res.send(`Update User with ID ${req.params.id}`)
    })
    .delete((req, res) => {
        res.send(`Delete User with ID ${req.params.id}`)
    }) */



/* publicRouter.post('/', function(req,res,next){
    userService.setUsers(function(err, result){
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
) */

module.exports = publicRouter;