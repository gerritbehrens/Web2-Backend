const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database/db')

const fs = require('fs')
const key = fs.readFileSync('./certificates/key.pem')
const cert = fs.readFileSync('./certificates/cert.pem')
const https = require('https');

//Routes
const publicUsersRoute = require('./endpoint/user/PublicUsersRoute')
const authenticationRoutes = require('./endpoint/authentication/AuthenticationRoute')
const userRoutes = require('./endpoint/user/UserRoute')
const forumThreadRoutes = require('./endpoint/forumThreads/ForumThreadsRoute')
const forumMessagesRoutes = require('./endpoint/forumMessages/ForumMessageRoute')

const userService = require('./endpoint/user/UserService')

const app = express()

const server = https.createServer({key: key, cert: cert }, app);
app.use(bodyParser.json());

/* Adding the routes */
app.use('/publicUsers', publicUsersRoute);
app.use('/authenticate', authenticationRoutes);
app.use('/users', userRoutes);
app.use('/forumthreads', forumThreadRoutes);
app.use('/forumMessages', forumMessagesRoutes);

/* Initiate the database connection */
database.initDB(function (err, db) {
  if (db) {
    console.log("Connection Successful");
    //Create an admin account if it does not already exist!
    userService.searchUser("admin", function (err, result) { })
  }
  else {
    console.log("Error while establishing a connection.")
  }
})

//Error Handler
app.use(function(req, res, next){
  res.status(404).json("Sorry can not find that. This url does not exist.")
})

app.get('/', (req, res) => { res.send('this is an secure server') });

/* Establish connection to host and listen */
server.listen(433, () => {console.log('listening on 443')})
// const port = 8080
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })