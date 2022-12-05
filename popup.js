const startButton = document.getElementById("start_button");
const loadButton = document.getElementById("load_button");
var state = true;

function onButtonClick() {
  chrome.storage.sync.get("state", function (btn) {
    if (btn.state === true) {
      startButton.style.display = 'none';
      loadButton.style.display = 'flex';
    }
    else if (btn.state === undefined) {
      startButton.style.display = 'block';
      startButton.innerHTML = 'Start';
    } else if (btn.state === false) {
      startButton.style.display = 'block';
      startButton.innerHTML = 'Continue';
    }
  });
}


const URL = "https://localhost:7245/api/Home";

async function getCurrentIndex() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("index", (value) => {
      resolve(value["index"]);
    });

  })
}

async function getDate() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("date", (value) => {
      resolve(value["date"]);
    });

  })
}



function sendGETRequest() {
  fetch(URL, { method: "GET", headers: { 'Content-Type': 'application/json' } })
    .then(response => response.json())
    .then(data => {
      chrome.storage.sync.set({ "index": 0 });
      chrome.storage.local.set({ "data": data });
      chrome.storage.sync.set({ "currentData": data[0] });
      state = false;
      chrome.storage.sync.set({ "state": state });
      window.close();
      chrome.runtime.sendMessage({ message: "writeCarNumber" });
    })
    .catch((error) => {
      console.log(error);
    });

}

async function startButton_clickHandler() {
  const index = await getCurrentIndex();
  if (index === undefined) {
    chrome.storage.sync.set({ "state": state });
    chrome.storage.sync.set({ "date": Date.now() });
    sendGETRequest();
  } else {
    chrome.runtime.sendMessage({ message: "writeCarNumber" });
  }
  onButtonClick();

}

startButton.onclick = function execute() {
  startButton_clickHandler();
}


setInterval(async () => {
  const date = new Date(await getDate());
  const newDate = new Date(Date.now());
  const diffTime = Math.abs(newDate - date);
  const diffDays = (diffTime / (1000 * 60 * 60 * 24));
  if (diffDays >= 1) {
    startButton.click();
  }
}, 1000 * 60 * 60 * 4);