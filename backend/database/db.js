const mongose = require('mongoose')
require('dotenv').config()
const dbpass = process.env.DBPASSWORD
const userdb = process.env.DBUSER

const db =mongose.connect('mongodb+srv://'+userdb+':'+dbpass+'@cluster0.l1lwgre.mongodb.net/')

 module.exports = db