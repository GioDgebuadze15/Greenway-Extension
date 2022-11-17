async function getCurrentIndex() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("index", (value) => {
      resolve(value["index"]);
    });

  })
}

function updateIndex() {
  chrome.storage.sync.get('index', function (item) {
    chrome.storage.sync.set({ 'index': (item.index + 1) }, function () { });
  });

}

function setCurrentData(data) {
  chrome.storage.sync.get('currentData', function (item) {
    chrome.storage.sync.set({ 'currentData': item.currentData = data }, function () { });
  });

}


async function getCarData() {
  return new Promise((resolve) => {
    chrome.storage.local.get("data", (value) => {
      resolve(value["data"]);
    });

  })
}

function clearStorage() {
  chrome.storage.sync.remove("index", () => { });
  chrome.storage.local.remove("data", () => { });
  chrome.storage.sync.remove("currentData", () => { });
}

function checkForError() {
  const error = document.getElementById("RegistrationNumber-error");
  if (error === null) {
    chrome.runtime.sendMessage({ message: "startSearching" });
  } else {
    updateIndex();
    writeCarNumber();
  }
}




async function writeCarNumber() {
  const input = document.getElementById("RegistrationNumber");
  const index = await getCurrentIndex();
  const data = await getCarData();

  try {
    input.value = data[index].name;
  } catch (error) {
    if (index > data.length) {
      clearStorage();
      chrome.runtime.sendMessage({ message: "closeTab" });
    }
  }


  updateIndex();
  setCurrentData(data[index]);

  const button = document.getElementsByClassName("submit_car_info")[0];
  button.click();

  setTimeout(() => {
    checkForError();
  }, 2000);

}

writeCarNumber();



