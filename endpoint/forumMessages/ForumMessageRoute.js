var express = require('express');
var router = express.Router();
const isAuth = require('../utils/isAuthenticated')

var messageService = require('./ForumMessageService')
var fThreadService = require('../forumThreads/ForumThreadsService')

//Get all ForumMessages
router.get('/', function (req, res, next) {
    
    if (req.query.forumThreadID != null) {
        console.log(req.query.forumThreadID)
        console.log("Suche über parameter")

        fThreadService.searchForumsFromID(req, req.query.forumThreadID, (err, result) => {
            console.log(result)
            if (result) {
                messageService.getMessages(result, (err, msg) => {
                    if (msg) {
                        res.status(200).json(msg)
                    }
                    else{
                        res.status(500).json({ "Error": err })
                    }
                })
                //res.status(200).json(result);
            }
            else{
                console.log("I am here")
                res.status(500).json({ "Error": err })
            }
        })
    }
    else {
        console.log("Hohle jetzt alle Nachichten")
        messageService.getMessages("all", (err, result) => {
            if (result) {
                res.status(200).json(result);
            }
            else if(err) {
                res.status(500).json("Error while searching for Forum");
            }
        })
    }
})

router.post('/', isAuth.isAuthenticated, function (req, res, next) {

    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split('.')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [ID] = credentials.split(',');

    //Extract userID
    const userID = ID.split(':')[1].split('"')[1]

    fThreadService.searchForumsFromID(req, req.body.forumThreadID, (err, result) => {
        if (result) {
            messageService.setMessage(req, userID, (err, result) => {
                if (result) {
                    res.status(201).json(result)
                }
                else if (err) {
                    console.log("Ich bin hier")
                    res.status(409).json({ "Error ": err });
                }
                else {
                    res.status(500).json({ "Error ": err });
                }
            })
        }
        else if (err) {
            res.status(404).json({ "Error": err })
        }
    })

})

router.put('/:MessageID', isAuth.isAuthenticated, function (req, res, next) {

    let splitArr = req.originalUrl.split("/");

    let messageID = splitArr[splitArr.length - 1];

    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split('.')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [ID, name, isAdmin] = credentials.split(',');

    //Extract userID- and isAdministrator-Value
    const isAdministrator = isAdmin.split(':')[1]
    const userID = ID.split(':')[1].split('"')[1]

    messageService.updateMessage(req, messageID, userID, isAdministrator, (err, result) => {
        if (result && err == null) {
            res.status(200).json(result);
        }
        else if (err && result === "Not Authorized") {
            res.status(401).json(err)
        }
        else{
            res.status(404).json(err)
        }
    })
})

router.delete('/:MessageID', isAuth.isAuthenticated, function (req, res, next) {
    console.log("Correct Route choosen")
//Falsche ID
    
    splitArr = req.originalUrl.split("/");

    let messageID = splitArr[splitArr.length - 1];
    
    
    console.log(messageID + " in DeleteRoute")

    //Decode and split Base64
    const base64Credentials = req.headers.authorization.split('.')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [ID, name, isAdmin] = credentials.split(',');

    //Extract userID- and isAdministrator-Value
    const isAdministrator = isAdmin.split(':')[1]
    const userID = ID.split(':')[1].split('"')[1]

    messageService.deleteMessage(messageID, userID, isAdministrator, (err, result) => {
    
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