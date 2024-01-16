import Express from "express"
import session from "express-session"
import {join} from "path"
import {User} from "@prisma/client";
import { checkUser, getDoors } from "../DB/test";
import {serveFile} from "./fileServer";

const pagePath = "../Frontend/www/"
const app = Express()
const port = 3000

function checkAuth(id:string):number {
  if(!logged[id]) {
    return -1
  }
  const user:User = logged[id]
  if(user.isadmin) {
    return 1
  }
  return 0
}

const logged:{[key:string]:User} = {

}

app.use(Express.static('../Frontend/www/statics'))

app.use(
  session({
    secret: 'on s\'en fiche',
    resave: false,
    saveUninitialized: true,
  })
)

app.get('/', (req, res) => {
  res.send(serveFile("Dashboard.html"))
})
app.get('/login/', async (req, res) => {
  if(req.query.username && req.query.password) {
    // Check if user exist
    const authRes = await checkUser(req.query.username.toString(), req.query.password.toString())
    if(authRes == false) {
      res.send('Wrong credentials')
    } else {
      logged[req.session.id] = authRes
      console.log("Connected user : ", authRes.username)
      // User is connected !
      // Need to redirect to dashboard
    }
  } else {
    res.send(serveFile('/Login/Login.html'))
  }
})

app.post('/logout', (req, res) => {
  if (logged[req.session.id]) {
    delete logged[req.session.id]
  }
  res.send('Logged out successfully')
})

//create user
app.get('/createuser', (req,res) => {
  res.sendFile(join(__dirname, pagePath + '/createuser.html'));
  //user needs to contain only letters
}) 

app.get("/dashboard/", (req, res) => {
  const auth = checkAuth(req.session.id)
  if(auth == 0) {
    // Normal user
  } else if (auth == 1) {
    // admin
    const doors = getDoors()
  } else {
    // needs to redirect to login
  }
}) 

//lock/unlock doors
app.get('/doorsmanager', (req, res) => {
  res.sendFile(join(__dirname, pagePath + '/doorsmanager.html'));
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})