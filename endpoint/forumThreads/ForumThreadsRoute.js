var express = require('express');
var router = express.Router();
const userService = require('../user/UserService')

var fThreadService = require('./ForumThreadsService')

 router.get('/', function(req, res, next){
    fThreadService.getForums( (err, result) => {
        if(result)
        {
            res.status(200).json(result);
        }
        else{
            res.status(500).json("Error while searching for Forum");
        }
    })
});

router.get('/myForumThreads', userService.isAuthenticated, function(req, res, next){
    
    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split('.')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [ID] = credentials.split(',');

    //Extract userID
    const userID = ID.split(':')[1].split('"')[1]

    fThreadService.searchForumsFromUser( req, userID, (err, result) => {
        if(result)
        {
            res.status(200).json(result);
        }
        else if(err){
            res.status(404).json(err)
        }
    })
});

router.post('/', userService.isAuthenticated, function(req, res, next){
    
    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split('.')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [ID] = credentials.split(',');

    //Extract userID
    const userID = ID.split(':')[1].split('"')[1]

    fThreadService.setForum( req, userID, (err,result) => {
        if(result){
            res.status(201).json(result)
        }
        else if(err){
            res.status(409).json({ "Error ": err});
        }
        else{
            res.status(500).json({"Error ": err});
        }
    })
})

router.put('/', function(err, result){

})

router.delete('/', function(err, result){

})

module.exports = router;