const startButton = document.getElementById("start_button");

const URL = "https://localhost:7245/api/Home";
document.addEventListener('DOMContentLoaded', function () {
  startButton.addEventListener('click', startButton_clickHandler);
});


function sendGETRequest() {
  fetch(URL, { method: "GET", headers: { 'Content-Type': 'application/json' } })
    .then(response => response.json())
    .then(data => {
      chrome.storage.sync.set({ "index": 0 });
      chrome.storage.local.set({"data": data});
      chrome.storage.sync.set({"currentData": data[0]});

    })
    .catch((error) => {
      console.log(error);
    });

}



async function startButton_clickHandler() {
  // chrome.storage.sync.remove('index',()=>{});
  // chrome.storage.local.remove('data',()=>{});
  // chrome.storage.sync.remove('currentData',()=>{});
  sendGETRequest();
  chrome.runtime.sendMessage({ message: "writeCarNumber"});

}






