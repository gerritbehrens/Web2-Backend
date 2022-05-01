const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database/db')

const publicUsersRoute = require('./endpoint/user/PublicUsersRoute')
const authenticationRoutes = require('./endpoint/authentication/AuthenticationRoute')

//?????
const userService = require('./endpoint/user/UserService')

const app = express()
app.use(bodyParser.json());

/* Adding the routes */
app.use('/publicUsers', publicUsersRoute);
app.use('/authenticate', authenticationRoutes);

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

/* Establish connection to host and listen */
const port = 8080
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})