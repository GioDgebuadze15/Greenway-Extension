async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function closeTab() {
  const tab = await getCurrentTab();
  if (tab !== undefined) {
    chrome.tabs.remove(tab.id);
  }
}


chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message === "writeCarNumber") {
    const tab = await getCurrentTab();
    if (tab !== undefined) {
      if (/greenway\.ge/.test(tab.url)) {
        const id = tab.id;
        chrome.scripting.executeScript({
          target: { tabId: id },
          files: ["./contentScript.js"]
        });
      }
    }
  } else if (request.message === "startSearching") {
    const tab = await getCurrentTab();
    if (tab !== undefined) {
      if (/greenway\.ge/.test(tab.url)) {
        const id = tab.id;
        // chrome.webRequest.onCompleted.addListener(
        //   (details) => {
        //     console.log(details);
        //     const url = details.url;
        //     if (details.method === 'POST' && url.includes('https://greenway.ge/ka/Home/CalculatePrice')) {
        //       console.log("sending");
        //       // chrome.scripting.executeScript({
        //       //   target: { tabId: id },
        //       //   files: ["./pageEvent.js"]
        //       // });
        //     }
        //   },
        //   {
        //     urls: ['<all_urls>'],
        //   }
        // );
        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId: id },
            files: ["./pageEvent.js"]
          });
        }, 2000);
      }
    }
  } else if (request.message === "closeTab") {
    // chrome.runtime.onMessage.removeListener(pass listener);
    await closeTab();
  }
});
