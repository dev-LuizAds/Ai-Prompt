const nodemailer = require("nodemailer");
const fs = require('fs')
const path = require('path');
//const { configDotenv } = require("dotenv");
const imgSrc = path.join(__dirname, './ai_robot.gif')

require('dotenv').config()
const passEmail = process.env.EMAIL_PASS
const usermail = process.env.EMAILUSER



fs.readFile(imgSrc, (err)=>{
  if(err){console.log(err)}
 
})


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: usermail,
    pass: passEmail,
  },
});

class Message {
  constructor(message) {
    this.message = message;
  }
}

function greeting() {
  var dt = new Date();
  const hr = dt.getHours();
  

  if (hr < 12) {
    return (Message.message = "Good morning");
  } else if (hr < 18) {
    return (Message.message = "Good afternoon");
  } else {
    return (Message.message = "Good night");
  }
}

const sendMail = (email, question, response) => {
  fs.readFile(imgSrc, (err, data)=>{
    if(err){console.log(err)}

  })
  try {
    transporter.sendMail({
      from: " Ai-Prompt <luiz.VitorADS@outlook.com>",
      to: email,
      subject: greeting() + ", your question is ready",
      text: "",
      html: `<body style="background-color:#3CB371; padding:10px; border:1px solid white; color:white; font-family:arial; ">
      <div><img src="cid:unique@cid" style="width:50%, height:100px"/></div>
      <br/>
      <h4>${greeting()}, dear user.</h4>
      <h3>${question}</h3>
      </br><p>${response}</p>
      <p>Regards,</p>
      <p>Ai-Prompt Team Developers</p>
      </body>`,
      attachments: [
        {
          filename: 'ai_robot.gif',
          path: imgSrc,
          cid: 'unique@cid' // CID para referenciar a imagem no HTML
        }
      ]
    });
  } catch (err) {
    console.log("Erro: " + err);
  }

  console.log("Message Sent");
};

module.exports = sendMail;
