// TODO: For some reason this is causing an error in the service worker but it doesnt affect the extension
// background.js:1 Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.Understand this errorAI

import { ICarDetails } from "./content";

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

// Dictionary to store car details for each tab
const carDetailsCache: { [tabId: string]: ICarDetails | null } = {};

// Listen for car details from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log("Message received in background script:", message, sender, sendResponse);
    console.log("carDetailsCache", carDetailsCache);

    if (message.action === "carDetailsExtracted" && sender.tab?.id !== undefined) {
        carDetailsCache[sender.tab?.id] = message.carDetails;
        console.log(`Car details cached for tab ${sender.tab?.id}:`, message.carDetails, sendResponse);
    }


    if (message.action === "getCarDetails" && message.tabId !== undefined) {

        console.log('getCarDetails - TabId:', message.tabId);

        const carDetails = carDetailsCache[message.tabId] || null;
        sendResponse({ carDetails });
    }
});