const moongose = require('mongoose')

const db =moongose.connect("mongodb://127.0.0.1:27017/aiDatabase")

 module.exports = db