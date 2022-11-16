const startButton = document.getElementById("start_button");

const URL = "https://localhost:7245/api/Home";
document.addEventListener('DOMContentLoaded', function () {
  startButton.addEventListener('click', startButton_clickHandler);
});

async function getCurrentIndex() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("index", (value) => {
      resolve(value["index"]);
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
    })
    .catch((error) => {
      console.log(error);
    });

}



async function startButton_clickHandler() {
  const index = await getCurrentIndex();
  if(index === undefined){
    sendGETRequest();
  }
  chrome.runtime.sendMessage({ message: "writeCarNumber" });

}






