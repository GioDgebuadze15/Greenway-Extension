function getCurrentData() {
    return new Promise((resolve) => {
        chrome.storage.sync.get("currentData", (value) => {
            resolve(value["currentData"]);
        });

    })
}
function sendPutRequest(newData) {
    const URL = "https://localhost:7245/api/Home";
    fetch(URL, {
        method: "PUT", headers: { 'Content-Type': 'application/json' }, body:
            JSON.stringify(
                newData
            )
    })
        .catch((error) => {
            console.log(error);
        });
}

function refreshPage() {
    window.location.reload();
    setTimeout(() => {
        chrome.runtime.sendMessage({ message: "writeCarNumber" });
    }, 3000);
}


async function scrapePopup() {
    var div = null;
    var loader = null;
    var swal = null;
    var cancelInterval = setInterval(async () => {
        loader = document.getElementsByClassName("loader-container")[0];
        if (loader.style.display === 'none') {
            div = document.getElementsByClassName("inspection-result")[0];
            if (div !== null && div != undefined) {
                clearInterval(cancelInterval);
                const lastInspectedDate = div.children[1]
                    .innerText.trim();
                const nextInspectDate = div.children[2]
                    .innerText.trim()
                    .split(":")[1].trim();

                if (lastInspectedDate !== undefined && nextInspectDate !== undefined) {
                    let newData = await getCurrentData();
                    newData.lastDate = lastInspectedDate;
                    newData.nextDate = nextInspectDate;
                    sendPutRequest(newData);

                    const backBtn = document.getElementsByClassName("alert-close")[0];
                    if (backBtn !== undefined && backBtn !== null) {
                        backBtn.click();
                        chrome.runtime.sendMessage({ message: "writeCarNumber" });
                    }
                }
            }
            else{
                swal = document.getElementsByClassName("stoped-service")[0];
                if(swal !== null && swal !== undefined){
                    clearInterval(cancelInterval);
                    const swalOverLay = document.getElementsByClassName("swal-overlay")[0];
                    if (swalOverLay !== undefined && swalOverLay !== null) {
                    swalOverLay.click();
                    chrome.runtime.sendMessage({ message: "writeCarNumber" });
                    // refreshPage();
                    }
                }
            }
        }
    }, 300);
}
scrapePopup();