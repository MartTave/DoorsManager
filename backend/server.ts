import Express from "express"
import session from "express-session"
import {join} from "path"
import {User} from "@prisma/client";

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

app.use(
  session({
    secret: 'on s\'en fiche',
    resave: false,
    saveUninitialized: true,
  })
)

app.get('/', (req, res) => {
  console.log(req.session.id)
  res.send('Hello World!')
})
app.get('/login/', (req, res) => {
  res.sendFile(join(__dirname, pagePath + '/Login/Login.html'));
  if(req.query.email) {
    console.log(req.query.email)
    // Check if user exist
    if(true) {
      
    } else {
      res.send('Wrong credentials')
    }
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
  console.log(req.params)
  //user needs to contain only letters
}) 

//lock/unlock doors
app.get('/doorsmanager', (req, res) => {
  res.sendFile(join(__dirname, pagePath + '/doorsmanager.html'));
  //check if user has autority
  

  //check if door is locked/unlocked
  //if (doors.status == lock) { doors.unlock } else doors.lock
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})