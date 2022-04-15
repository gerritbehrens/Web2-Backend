var express = require('express');
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
    
    userService.setUser(function(err,result){
        console.log("Created User: " + result);
        if(result)
        {
            /* console.log(req.body) */
            res.send(Object.values(result));
        }
        else{
            res.send("Error while creating a user")
        }
    })  
})

/* publicRouter.get('/:id', (req,res) => {
    res.send(`Get User With ID ${req.params.id}`)
}) */

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