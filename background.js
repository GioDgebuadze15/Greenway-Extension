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


chrome.runtime.onMessage.addListener(async function listener(request, sender, sendResponse) {
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
        chrome.scripting.executeScript({
          target: { tabId: id },
          files: ["./pageEvent.js"]
        });
      }
    }
  } else if (request.message === "refreshPage") {

  }
  else if (request.message === "closeTab") {
    chrome.runtime.onMessage.removeListener(listener);
    // await closeTab();
  }
});
