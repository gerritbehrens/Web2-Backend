const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database/db')


const testRoutes = require('./endpoint/test/TestRoute')

const userRoutes = require('./endpoint/user/UserRoute')

const publicUsersRoute = require('./endpoint/user/PublicUsersRoute')

const app = express()
app.use(bodyParser.json());

/* Adding the routes */
/* app.use('/', userRoutes); */
/* app.use('/user', userRoutes); */

app.use('/publicUsers', publicUsersRoute);


database.initDB(function(err,db){
  if(db){
    console.log("Anbindung von Datenbank erfolgreich");
  }
  else{
    console.log("Anbindung von Datenbank gescheitert.")
  }
})

const port = 8080
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})