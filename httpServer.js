const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database/db')

const publicUsersRoute = require('./endpoint/user/PublicUsersRoute')

const app = express()
app.use(bodyParser.json());

/* Adding the routes */
app.use('/publicUsers', publicUsersRoute);

/* Initiate the database connection */
database.initDB(function(err,db){
  if(db){
    console.log("Connection Successful");
  }
  else{
    console.log("Error while establishing a connection.")
  }
})

/* Establish connection to host and listen */
const port = 8080
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})