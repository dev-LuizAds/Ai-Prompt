
//Variables
var btnSendMsg = document.getElementById("btnSendMsg");
var inputQuestion = document.getElementById("inputQuestion");
var answerContent = document.getElementById("answerField");
var spanTag = document.getElementById("spantag");
var spinnerLoad = document.querySelector("#loader");
var cleanbtn = document.getElementById("cleanData");
var btnAudio = document.getElementById("btnAudio");
var title = document.querySelector("title");
const bntSave = document.getElementById("saveBtn");
const btnDarkMode = document.getElementById("btnMode");
var body = document.querySelector("body");
var main = document.querySelector("main");
const microPhoneBTn = document.getElementById("microPhoneBTn");
const sendMailbtn = document.getElementById("sendMail");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const emailValue = document.getElementById("emailValue");
const emailBtn = document.getElementById("emailBtn");
const modalWindow = document.getElementById("modalParicular");
const optionBtn = document.getElementById("option");
const historyBtn = document.getElementById("historic");
const modalHistory = document.getElementById("modalHistory");
const card = document.getElementById("card");
const windowHistory = document.getElementById("windowHistory");
const btnFile = document.getElementById("fileContent");
const alertMessage = document.getElementById('alertMessage')
//Event to hide the icons options
let btnOn = true;
const iconOptions = document.getElementById("iconOptions");
optionBtn.addEventListener("click", () => {
  btnOn = !btnOn;
  if (btnOn) {
    iconOptions.style.display = "block";
    optionBtn.style.color = "#1f90ee";
  } else {
    iconOptions.style.display = " none";
    optionBtn.style.color = "white";
  }
});

optionBtn.addEventListener("mouseover", () => {
  alertText.innerHTML = "Click for options";
});
optionBtn.onmouseleave = () => {
  alertText.innerHTML = "";
};

document.addEventListener("keypress", (evet) => {
  if (evet.key == "Enter") {
    btnSendMsg.click();
  }
});

//Funtiocn for audio convert text
function audioText() {
  window.SpeechRecognition =
    window.webkitSpeechRecognition || window.SpeechRecognition;

  if (window.SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR"; // Brazilian Portuguese

    recognition.onresult = (e) => {
      var transcript = e.results[0][0].transcript;
      inputQuestion.value = transcript;
    };

    recognition.onerror = (event) => {
      console.log("Error: " + event.error);
    };

    recognition.onend = () => {
      microPhoneBTn.style.color = "green";
      title.textContent = "AI-Prompt";
    };

    recognition.start();
    microPhoneBTn.style.color = "red";
    title.textContent = "Capturing audio...";
    inputQuestion.value = "";

    var bip = new Audio("bip.mp3");
    bip.play();
  } else {
    alert("Browser does not support speech recognition.");
  }
}

microPhoneBTn.addEventListener("click", audioText);

microPhoneBTn.addEventListener("mouseover", () => {
  alertText.textContent = "Audio to text transcription";
});

microPhoneBTn.addEventListener("mouseout", () => {
  alertText.textContent = "";
});

// OpenAI - key
function requestAI() {
  if (inputQuestion.value != "" || inputQuestion.value == undefined) {
    btnSendMsg.innerText = "Searching...";
    btnSendMsg.setAttribute("Disabled", true);
    inputQuestion.disabled = true;
    spanTag.innerHTML = inputQuestion.value;
    loader.style.display = "block";

    console.time();
    var startTimeReq = performance.now();


    fetch("http://localhost:3000/req", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: inputQuestion.value
        
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        answerContent.textContent = data.choices[0].message.content;
      })
      .catch((error) => {
        console.Error("Error:" + error);
        answerContent.textContent = "Erro ou resposta não encontrada";
      })
      .finally(() => {
        console.timeEnd();
        var endtime = performance.now();
        var tempo = ((endtime - startTimeReq) / 1000).toFixed(2);
        console.log("tempo final:" + tempo + " s");
        alertText.innerHTML = "Answer found in " + tempo + "s";
        inputQuestion.value = "";
        inputQuestion.disabled = false;
        setTimeout(() => {
          alertText.innerHTML = "";
        }, 2000);
        loader.style.display = "none";
        btnSendMsg.removeAttribute("Disabled");
        btnSendMsg.innerText = "Send";
      });
  } else {
    alert("Fill the field Question first.");
  }
}

btnSendMsg.addEventListener("click", requestAI);

// function for copy content

var interval = 2000;
var clickIcon = document.getElementById("clickIcon");
var alertText = document.querySelector("#alertText");
function copyContent() {
  clickIcon.style.color = "#87cefa";
  alertText.innerHTML = "Copied";
  var x = answerContent.textContent;
  navigator.clipboard.writeText(x);
}

clickIcon.addEventListener("click", () => {
  if (spanTag.innerHTML != "") {
    copyContent();
    setTimeout(function () {
      clickIcon.style.color = "white";
      alertText.textContent = "";
    }, interval);
  } else {
    alert("No content to copy.");
  }
});

clickIcon.addEventListener("mouseover", () => {
  alertText.innerHTML = "Copy";
});
clickIcon.addEventListener("mouseout", () => {
  alertText.innerHTML = "";
});

// ending of code for copy Function //

// Function - clean fields

cleanbtn.addEventListener("mouseover", () => {
  alertText.innerHTML = "Reset data";
});
cleanbtn.addEventListener("mouseout", () => {
  alertText.innerHTML = "";
});

function clearData() {
  if (answerContent.textContent && spanTag.innerHTML) {
    var reply = confirm("Do you want to reset these fields?");
    if (reply === true) {
      answerContent.textContent = "";
      spanTag.innerHTML = "";
      console.clear();
      cleanbtn.style.color = "#87cefa";
      alertText.textContent = "Cleaning...";
    }
  }
}

cleanbtn.addEventListener("click", () => {
  if (spanTag.innerHTML != "") {
    clearData();
    setTimeout(() => {
      alertText.innerHTML = "";
      cleanbtn.style.color = "white";
    }, 2000);
    stopAudio();
  } else {
    alert("No content to reset.");
  }
});

//function for downloading
function downloadFunction() {
  btnDownload.style.color = "#87cefa";
  alertText.innerHTML = "Downloading content...";
}

var btnDownload = document.getElementById("dlBtn");
btnDownload.addEventListener("click", () => {
  if (answerContent.innerHTML != "" || spanTag.innerHTML != "") {
    downloadFunction();
    createPDF();
    setTimeout(() => {
      btnDownload.style.color = "white";
      alertText.innerHTML = "";
    }, 3000);
  } else {
    alert("No content to download;");
  }
});

//effects for alertText
btnDownload.addEventListener("mouseover", () => {
  alertText.innerHTML = "Download";
});

btnDownload.addEventListener("mouseout", () => {
  alertText.innerHTML = "";
});

//function para hmtm2PDF

function createPDF() {
  options = {
    margin: [20, 20, 20, 20],
    filename: spanTag.innerHTML + ".pdf",
    html2canvas: { scale: 2 },
    js2PFD: { unit: "px", format: "A4", orientation: "portrait" },
  };
  html2pdf()
    .set(options)
    .from(
      `<div style='background-color: #3CB371; width:100%; height:50px; top:0'></div></br> <h5 style='color:green'>${spanTag.innerHTML}</h5><div style='display: flex; justify-content: center; align-items: center; width: 100%;'><p style='text-align: justify; width: 100%;'>${answerContent.innerHTML}</p></div>`
    )
    .save();
}

// function for converting text in audio;

btnAudio.addEventListener("mouseover", () => {
  alertText.innerHTML = "Audio Transcription";
});
btnAudio.addEventListener("mouseout", () => {
  alertText.innerHTML = "";
});

//FUNCTION FOR AUDIO READING OF ANSWER CONTENT
function createAudio() {
  if (answerContent.innerHTML != "" || undefined) {
    let utterance = new SpeechSynthesisUtterance(answerContent.textContent);

    let startTime, endTime;

    utterance.onstart = () => {
      startTime = Date.now();
      btnAudio.style.color = "#87cefa";
      btnAudio.classList.add("fa-regular", "fa-circle-stop");
      btnAudio.classList.remove("fa-volume-low");
      document.querySelector("title").innerHTML = "Reading...";
      document.getElementById("alertText").innerHTML = "Reading";
    };

    utterance.onend = () => {
      endTime = Date.now();
      var timeaudio = (endTime - startTime) / 1000; // Duration in seconds
      btnAudio.style.color = "white";
      console.log(timeaudio);
      btnAudio.classList.add("fa-solid", "fa-volume-low");
      btnAudio.classList.remove("fa-circle-stop");
      alertText.innerHTML = "";
      document.querySelector("title").innerHTML = "AI-Prompt";
    };

    speechSynthesis.speak(utterance);
  } else {
    alert("No content to read.");
  }
}

btnAudio.addEventListener("click", createAudio);
btnAudio.addEventListener("dblclick", stopAudio);

//Stop audio
function stopAudio() {
  speechSynthesis.cancel();
  btnAudio.style.color = "white";
  alertText.innerHTML = "";
  //console.log('Audio cancelado')
  alertText.innerHTML = "";
  btnAudio.classList.add("fa-solid", "fa-volume-low");
  btnAudio.classList.remove("fa-circle-stop");
  document.querySelector("title").innerHTML = "AI-Prompt";
}

//btnAudio.addEventListener('click', stopAudio)
window.addEventListener("load", stopAudio);

//FUNCTION FOR SAVING CONTENT
bntSave.addEventListener("mouseover", () => {
  alertText.innerHTML = "Save data";
});

bntSave.addEventListener("mouseout", () => {
  alertText.innerHTML = "";
});

// function for saving data
function saveData() {
  if (answerContent.innerHTML != "" && spanTag.innerHTML != "") {
    var response = answerContent.innerHTML;
    var question = spanTag.innerHTML;

    var createdAt = new Date().toLocaleString();

    bntSave.style.color = "#87cefa";

    var obj = {
      criatedAt: createdAt,
      question: question,
      response: response,
    };

    // code for saving data on mongo

    var data = {
      question: question,
      response: response,
    };

    fetch("http://localhost:3000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        alert(res.message);
      })
      .catch((err) => console.log(err + " erro"));

    // CODE FOR SAVING DATA ON EXCEL
    fetch("https://api.sheetmonkey.io/form/36vS2oM29cRq6nVcmF1aV1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((res) => {
        console.log(res.status);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        window.location.reload();
        alertText.innerHTML = "Saved";
        bntSave.style.color = "white";
        setInterval(() => {
          alertText.innerHTML = "";
        }, 2000);
      });
  } else {
    alert("No content to save.");
  }
}

bntSave.addEventListener("click", saveData);

//FUNCTION DARK-mode
var isOn = localStorage.getItem("estado") === "true";
function changeMode() {
  isOn = !isOn; // Alterna o estado

  localStorage.setItem("estado", isOn); // Salva o estado no localStorage

  applyTheme(); // Aplica o tema baseado no novo estado
}

function applyTheme() {
  if (isOn) {
    body.style.backgroundColor = "white";
    btnDarkMode.style.color = "#001969";
    main.style.backgroundColor = "#00a86b";
    modalWindow.style.backgroundColor = "#00a86b";
    inputQuestion.style.backgroundColor = "white";
    inputQuestion.style.color = "black";
    emailValue.style.color = "darkgreen";
    emailValue.style.backgroundColor = "white";
    card.style.color = "darkgreen";
    card.style.backgroundColor = "#f5f5f5";
    windowHistory.style.backgroundColor = "#00a86b";
    answerContent.style.color = "darkgreen";
    answerScreen.style.backgroundColor = "#f5f5f5";
    btnDarkMode.classList.add("fa-solid", "fa-moon");
    btnDarkMode.classList.remove("fa-sun");
    spanTag.style.color = "white";

    microPhoneBTn.style.color = "green";
    btnSendMsg.style.border = "2px solid white";
  } else {
    body.style.backgroundColor = "rgb(33, 32, 32)";
    card.style.color = "aliceblue";
    card.style.backgroundColor = "#3f3f3f";
    windowHistory.style.backgroundColor = "rgb(49, 47, 47)";
    btnDarkMode.style.color = "yellow";
    main.style.backgroundColor = "rgb(49, 47, 47)";
    modalWindow.style.backgroundColor = "rgb(49, 47, 47)";
    emailValue.style.color = "aliceblue";
    emailValue.style.backgroundColor = "#3f3f3f";
    inputQuestion.style.color = "aliceblue";
    inputQuestion.style.backgroundColor = "#3f3f3f";
    answerContent.style.color = "white";

    microPhoneBTn.style.color = "aliceblue";
    answerScreen.style.backgroundColor = "#3f3f3f";
    btnDarkMode.classList.add("fa-solid", "fa-sun");
    btnDarkMode.classList.remove("fa-moon");
    spanTag.style.color = "rgb(28, 219, 69)";
    btnSendMsg.style.border = "none";
  }
}

// Inicializa o tema ao carregar a página
applyTheme();

btnDarkMode.addEventListener("click", changeMode);

// functions for modal

sendMailbtn.addEventListener("click", () => {
  if (answerContent.innerHTML == "" && spanTag.innerHTML == "") {
    alert("For sending email,  it is necessary to have a question first!");
  } else {
    modal.style.display = "block";
    modal.blur();
  }
});

closeBtn.onclick = () => {
  modal.style.display = "none";
};

sendMailbtn.onmouseover = () => {
  alertText.innerHTML = "Send email.";
  setTimeout(() => {
    alertText.innerHTML = "";
  }, 2000);
};

//Sending email

emailBtn.addEventListener("click", mailSend);

function mailSend() {
  if (emailValue.value == "") {
    alert("Include a valid email.");
  } else {
    var response = answerContent.innerHTML;
    var question = spanTag.innerHTML;
    var email = emailValue.value;

    const data = {
      email: email,
      question: question,
      response: response,
    };
    inputQuestion.disabled = false;
    console.log(data);

    fetch("http://localhost:3000/senddata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
      })
      .catch((err) => {
        console.error(err);
        alert(message);
      })
      .finally(() => {
        modal.style.display = "none";
        emailValue.value = "";
        alertText.innerHTML = "Email sent.";
        sendMailbtn.style.color = "#1f90ee";
        setTimeout(() => {
          alertText.innerHTML = "";
          sendMailbtn.style.color = "white";
        }, 2000);
      });
  }
}

//File reader with AI

btnFile.addEventListener("change", function () {
  console.log("File sent");
  return;
});

//History list of questions ans response

function showHistory() {
  const url = "http://localhost:3000/list";
  fetch(url)
    .then((res) => res.json())
    .then((dados) => {
      document.getElementById("infodata").style.display = "none";
      dados.data.map((item) => {
        const h6 = document.createElement("h6");
        var p = document.createElement("p");
        var dateValue = document.createElement("p");
        var a = document.createElement("a");
        let iconDelete = document.createElement("i");

        const card = document.querySelector("#card");

        const urlId = `http://localhost:3000/delete/${item._id}`;
        a.href = urlId;
        h6.style.color = "rgb(28, 219, 69)";
        a.style.textDecoration = "none";
        a.style.color = "green";
        iconDelete.setAttribute("class", "fa-solid fa-trash-can");
        iconDelete.setAttribute("title", "Delete question");
        iconDelete.style.fontSize = "small";

        h6.textContent = item.question;
        p.innerHTML = item.response;
        dateValue.innerHTML = `Question posed on ${new Date(
          item.createdAt
        ).toLocaleDateString("pt-BR")}.<hr>`;

        a.onclick = (e) => {
          e.preventDefault();
          var param = confirm("Do you really want to delete this question?");
          if (param != false) {
            fetch(urlId, {
              method: "DELETE",
            })
              .then((res) => res.json())
              .then((data) => {
                alert(data.message);
                card.removeChild(h6);
                card.removeChild(p);
                card.removeChild(a);
                card.removeChild(dateValue);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        };

        p.style.fontSize = "small";
        p.style.textAlign = "justify";
        dateValue.style.fontSize = "smaller";
        dateValue.style.textAlign = "end";

        card.appendChild(h6);
        card.appendChild(p);
        card.appendChild(a);
        a.appendChild(iconDelete);
        card.appendChild(dateValue);
      });
    })
    .catch((err) => {
      console.log("Erro: " + err);
    });
}
showHistory();

historyBtn.addEventListener("mouseover", () => {
  alertText.innerHTML = "Historic";
});
historyBtn.addEventListener("mouseout", () => {
  alertText.innerHTML = "";
});


// alert message (Connection)

function alertMesg(){

  if(!navigator.onLine){ 
    alertMessage.style.display = 'block'
  }else{
    alertMessage.style.display = 'none' 
  }

}
setInterval(alertMesg, 5000)
alertMesg()
