const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./database/db");
const sendMail = require("./mailer/mailer");
const Question = require("./database/questionSchema");
const path = require("path");
const {GoogleGenAI}= require('@google/genai')


app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(express.static(path.join(__dirname, "Frontend")));
//database Connection
db.then(() => console.log("Database connected.")).catch((err) =>
  console.log("Error " + err)
);

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

app.get("/list", async (req, res) => {
  try {
    const items = await Question.find().sort({ createdAt: -1 });
    if (items.length > 0) {
      res.status(200).json({ err: false, data: items });
    } else {
      res.status(404).json({ message: "File not found." });
    }
  } catch (err) {
    console.log("Error: " + err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/question/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const item = await Question.findById(id);
    if (item) {
      res.status(200).json({ err: false, data: item });
    } else {
      res.status(404).json({ message: "No file found." });
    }
  } catch (err) {
    console.log("Error: " + err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/data", async (req, res) => {
  const { question, response, access } = req.body;

  try {
    const ask = await Question.create({ question, response, access });
    if (ask) {
      res.status(201).json({ message: "New question registered." });
      console.log("Question registered.");
    } else {
      res.status(404).json({ message: "Fail to register question." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Erro " + err);
  }
});

app.post("/senddata", (req, res) => {
  const { email, question, response } = req.body;
  try {
    sendMail(email, question, response);
    return res.status(200).json({ message: "Email Sent with success." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.delete("/delete/:id", async function (req, res) {
  const question = await Question.findByIdAndDelete(req.params.id);
  try {
    if (question) {
      res.status(200).json({ message: "Question deleted." });
      console.log('Question deleted.')
    } else {
      res.status(404).json({ message: "Question not found." });
    }
  } catch (err) {
    console.log(err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Error." });
      console.log(err)
    }
  }
});

//rota para requisições da api Gemini- Google

require("dotenv").config();
const apiKey = process.env.KEY;
//const OpenAI = require("openai");


app.post("/req", async (req, res) => {
  const { question } = req.body;
  const ai = new GoogleGenAI({apiKey})
  try{
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: question,
    config:{
      maxOutputTokens:300,
      temperature:0.3,
      systemInstruction:'Você é um professor que responde de forma objetiva as perguntas. Seu nome é Pluto, um IA assistente.'
    }
  })
    return res.json(response);
    
  } catch (err) {
    console.log("Error calling the API." + err);
    if(err.status=='429' || err.code == '429'){
      res.status(429).json({err})
      console.log(err)
    }
    res.status(500).json("Server error.");
  }
});



app.listen(3000, () => {
  console.log("Server running at port 3000.");
});


