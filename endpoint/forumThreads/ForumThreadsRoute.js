var express = require('express');
var router = express.Router();
const isAuth = require('../utils/isAuthenticated')
const forumMessages = require('../forumMessages/ForumMessageService')

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


router.get('/myForumThreads', isAuth.isAuthenticated, function (req, res, next) {

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

router.get('/:forumThreadID/forumMessages', function (req, res, next) {

    let searchItemID = req.params.forumThreadID

    fThreadService.searchForumsFromID(req, searchItemID, (err, result) => {
        if (result) {
            forumMessages.getMessages(result, (err, msgs) => {
                if (msgs) {
                    res.status(200).json(msgs)
                }
                else {
                    res.status(500).json(err)
                }
            })
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





router.post('/', isAuth.isAuthenticated, function (req, res, next) {

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

router.put('/:forumThreadID', isAuth.isAuthenticated, function (req, res, next) {

    let splitArr = req.originalUrl.split("/");

    let threadID = splitArr[splitArr.length - 1];

    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split('.')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [ID, name, isAdmin] = credentials.split(',');

    //Extract userID- and isAdministrator-Value
    const isAdministrator = isAdmin.split(':')[1]
    const userID = ID.split(':')[1].split('"')[1]

    fThreadService.updateForum(req, threadID, userID, isAdministrator, (err, result) => {
        if (result && err == null) {
            res.status(200).json(result);
        }
        else if (err && result === "Not Authorized") {

            res.status(401).json(err)
        }
        else {
            res.status(404).json(err)
        }
    })
})

router.delete('/:forumThreadID', isAuth.isAuthenticated, function (req, res, next) {
    let splitArr = req.originalUrl.split("/");

    let threadID = splitArr[splitArr.length - 1];

    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split('.')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [ID, name, isAdmin] = credentials.split(',');

    //Extract userID- and isAdministrator-Value
    const isAdministrator = isAdmin.split(':')[1]
    const userID = ID.split(':')[1].split('"')[1]

    fThreadService.deleteForum(req, threadID, userID, isAdministrator, (err, result) => {
        if (result && !err) {
            res.status(204).json();
        }
        else if (err && result == "Not Authorized") {
            res.status(401).json(err);
        }
        else if (err && result == null) {
            res.status(404).json(err)
        }
    })
})

module.exports = router;