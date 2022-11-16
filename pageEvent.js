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


async function scrapePopup() {
    var div = null;
    var cancelInterval = setInterval(() => {
        div = document.getElementsByClassName("inspection-result-alert")[0];
        if (div !== null && div !== undefined) {
            clearInterval(cancelInterval);
        }
    }, 100);
    console.log(div);
    if (div !== null) {
        console.log("plplpllp");
        console.log(div);
        const innerDiv = document.getElementsByClassName("inspection-result")[0];
        const lastInspectedDate = innerDiv.children[1]
            .innerText.trim();
        const nextInspectDate = innerDiv.children[2]
            .innerText.trim()
            .split(":")[1].trim();

        if (lastInspectedDate !== undefined && nextInspectDate !== undefined) {
            let newData = await getCurrentData();
            newData.lastDate = lastInspectedDate;
            newData.nextDate = nextInspectDate;
            sendPutRequest(newData);

            const backBtn = document.getElementsByClassName("alert-close")[0];
            if (backBtn !== undefined) {
                backBtn.click();
                chrome.runtime.sendMessage({ message: "writeCarNumber" });
            }
        }
    } 
    // else {
    //     chrome.runtime.sendMessage({ message: "writeCarNumber" });
    // }
}
scrapePopup();