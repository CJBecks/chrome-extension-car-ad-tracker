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

/**
 * Update the badge text with the count of new car listings.
 */
function showNewCarBadge() {
    chrome.action.setBadgeText({ text: " " });
    chrome.action.setBadgeBackgroundColor({ color: "#FFA500" }); // Orange background for the badge
}

/**
 * Update the badge to indicate a tracked car is detected with a softer green color and smaller text.
 */
function showTrackedCarBadge() {
    chrome.action.setBadgeText({ text: " " });
    chrome.action.setBadgeBackgroundColor({ color: "#228B22" }); // Darker green (ForestGreen)
    chrome.action.setBadgeTextColor({ color: "#FFFFFF" }); // Ensure text is readable
}

/**
 * Clear the badge text.
 */
function clearBadge() {
    chrome.action.setBadgeText({ text: "" });
}

/**
 * Save a car's details to the global tracked cars dictionary in local storage.
 * @param carDetails - The car details to save.
 */
function saveCarToTrackedCars(carDetails: ICarDetails) {
    chrome.storage.local.get(["trackedCars"], (result) => {
        const trackedCars = result.trackedCars || {};
        trackedCars[carDetails.url] = carDetails;
        chrome.storage.local.set({ trackedCars });
    });
}

/**
 * Remove a car from the global tracked cars dictionary in local storage.
 * @param carUrl - The URL of the car.
 */
function removeCarFromTrackedCars(carDetails: ICarDetails) {
    chrome.storage.local.get(["trackedCars"], (result) => {
        const trackedCars = result.trackedCars || {};
        delete trackedCars[carDetails.url];
        chrome.storage.local.set({ trackedCars });
    });
}

/**
 * Retrieve the global tracked cars dictionary from local storage.
 * @returns A promise resolving to the tracked cars dictionary.
 */
function getAllTrackedCars(): Promise<{ [carUrl: string]: ICarDetails[] }> {
    return new Promise((resolve) => {
        chrome.storage.local.get(["trackedCars"], (result) => {
            resolve(result.trackedCars || []);
        });
    });
}

/**
 * Clear all saved cars from the global tracked cars dictionary.
 */
function clearAllSavedCars() {
    chrome.storage.local.set({ trackedCars: {} });
}

// Listen for car details from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "carDetailsExtracted" && sender.tab?.id !== undefined) {
        carDetailsCache[sender.tab?.id] = message.carDetails;

        if (message.carDetails) {
            getAllTrackedCars().then((trackedCars) => {
                if (!trackedCars[message.carDetails.url]) {
                    showNewCarBadge(); // Update the badge with the new count
                } else {
                    showTrackedCarBadge(); // Show a green badge with a checkmark
                }
            });
        }
    }

    if (message.action === "getCarDetails" && message.tabId !== undefined) {
        const carDetails = carDetailsCache[message.tabId] || null;
        sendResponse({ carDetails });
    }

    if (message.action === "getAllTrackedCars") {
        getAllTrackedCars().then((trackedCars) => {
            sendResponse({ trackedCars });
        });
        return true; // Indicate asynchronous response
    }

    if (message.action === "saveCarToTrackedCars") {
        saveCarToTrackedCars(message.carDetails);
        return true; // Indicate asynchronous response
    }

    if (message.action === "removeCarFromTrackedCars") {
        removeCarFromTrackedCars(message.carDetails);
        return true; // Indicate asynchronous response
    }

    if (message.action === "clearAllSavedCars") {
        clearAllSavedCars();
        return true; // Indicate asynchronous response
    }

    if (message.action === "clearBadge") {
        clearBadge();
        return true; // Indicate asynchronous response
    }

    if (message.action === "showNewCarBadge") {
        showTrackedCarBadge();
        return true; // Indicate asynchronous response
    }

    if (message.action === "showTrackedCarBadge") {
        showTrackedCarBadge();
        return true; // Indicate asynchronous response
    }
});