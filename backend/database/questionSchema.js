const moongose = require("mongoose");

const questionSchema = new moongose.Schema({
  question: String,
  response: String,
},{
    timestamps:true
});

const Question = moongose.model("Question", questionSchema);

module.exports = Question;
