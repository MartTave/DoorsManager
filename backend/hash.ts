const bcrypt = require('bcrypt')

const plaintextPassword = 'password123'

// Generate a salt (a random string) to add complexity to the hashing process
const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

// Hash the password using the generated salt
const hashedPassword = bcrypt.hashSync(plaintextPassword, salt)

console.log('Hashed Password:', hashedPassword)