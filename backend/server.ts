import Express from "express"
import {join} from "path"
const pagePath = "../Frontend/www/"
const app = Express()
const port = 3000


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/login/', (req, res) => {
  res.sendFile(join(__dirname, pagePath + '/Login/Login.html'));

  for(let k in req.query) {
    console.log("key: ", k )
    console.log("value : ", req.query[k])
  }
  if(req.query.email) {
    
    console.log(req.query.email)
  }
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