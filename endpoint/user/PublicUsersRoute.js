var express = require('express')
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

publicRouter.post('/', function(req,res,next){
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
)

module.exports = publicRouter;