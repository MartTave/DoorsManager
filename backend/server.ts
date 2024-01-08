import Express from "express"
import {join} from "path"
const pagePath = "../frontend/www/"
const app = Express()
const port = 3000


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/login/', (req, res) => {
  res.sendFile(join(__dirname, pagePath + '/login.html'));
  console.log(req.params)
  if(req.query.username) {
    // Erreur login invalid
    console.log(req.query.username)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})