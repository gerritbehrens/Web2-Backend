var express = require('express');
var router = express.Router();
const userService = require('../user/UserService')

var fThreadService = require('./ForumThreadsService')
router.get('/', function (req, res, next) {

    const ownerID = req.query.ownerID
    if (ownerID) {

        fThreadService.searchForumsFromUser(req, ownerID, (err, result) => {
            if (result) {
                res.status(200).json(result)
            }
            else {
                res.status(404).json({ "Error": "No Forum found for this User" })
            }
        })
    }
    else {
        fThreadService.getForums((err, result) => {
            if (result) {
                res.status(200).json(result);
            }
            else {
                res.status(500).json("Error while searching for Forum");
            }
        })
    }

})


router.get('/myForumThreads', userService.isAuthenticated, function (req, res, next) {

    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split('.')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [ID] = credentials.split(',');

    //Extract userID
    const userID = ID.split(':')[1].split('"')[1]

    fThreadService.searchForumsFromUser(req, userID, (err, result) => {
        if (result) {
            res.status(200).json(result);
        }
        else if (err) {
            res.status(404).json(err)
        }
    })
});

router.get('/:forumThreadID', function (req, res, next) {

    let splitArr = req.originalUrl.split("/");

    let searchItemID = splitArr[splitArr.length - 1];

    fThreadService.searchForumsFromID(req, searchItemID, (err, result) => {
        if (result) {
            res.status(200).json(result);
        }
        else if (err) {
            res.status(404).json(err)
        }
    })
});



router.post('/', userService.isAuthenticated, function (req, res, next) {

    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split('.')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [ID] = credentials.split(',');

    //Extract userID
    const userID = ID.split(':')[1].split('"')[1]

    fThreadService.setForum(req, userID, (err, result) => {
        if (result) {
            res.status(201).json(result)
        }
        else if (err) {
            res.status(409).json({ "Error ": err });
        }
        else {
            res.status(500).json({ "Error ": err });
        }
    })
})

router.put('/:forumThreadID', userService.isAuthenticated, function (req, res, next) {

    let splitArr = req.originalUrl.split("/");

    let threadID = splitArr[splitArr.length - 1];

    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split('.')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [ID] = credentials.split(',');

    //Extract userID
    const userID = ID.split(':')[1].split('"')[1]

    fThreadService.updateForum(req, threadID, userID, (err, result) => {
        if (result) {
            res.status(200).json(result);
        }
        else if (err) {
            res.status(404).json(err)
        }
    })
})

router.delete('/:forumThreadID', userService.isAuthenticated, function (req, res, next) {
    let splitArr = req.originalUrl.split("/");

    let threadID = splitArr[splitArr.length - 1];

    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split('.')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [ID] = credentials.split(',');

    //Extract userID
    const userID = ID.split(':')[1].split('"')[1]

    fThreadService.deleteForum(req, threadID, userID, (err, result) => {
        if (result) {
            res.status(204).json();
        }
        else if (err) {
            res.status(404).json(err)
        }
    })
})

module.exports = router;