// TODO: For some reason this is causing an error in the service worker but it doesnt affect the extension
// background.js:1 Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.Understand this errorAI

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
            callActionToExtractCarDetailsFromTheDOM(activeInfo.tabId);
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        callActionToExtractCarDetailsFromTheDOM(tabId);
    }
});

/**
 * Call the content script to extract car details from the DOM.
 * @param tabId - The ID of the tab to extract car details from.
 */
function callActionToExtractCarDetailsFromTheDOM(tabId: number) {
    chrome.tabs.sendMessage(tabId, { action: "extractCarDetails" });
}