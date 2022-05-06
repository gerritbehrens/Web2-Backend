var express = require('express')
var router = express.Router();

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

router.post('/', function(err, result){
    fThreadService.setForum( (err,result) => {
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