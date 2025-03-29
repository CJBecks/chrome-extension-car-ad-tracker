import { autoTraderStrategy } from "./extractionStrategies/autotrader";
import { defaultStrategy } from "./extractionStrategies/default";

export interface ICarDetails {
  make?: string;
  model?: string;
  year?: string;
  price?: string;
  url: string;
  dateListed?: string;
  daysOnMarket?: number;
}


/**
 * Listen for messages from the background script.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message, sender, sendResponse);

  if (message.action === "extractCarDetails") {
      const car = extractCarDetails();

      if (car.make) {
        console.log('Found car details:', car, sender.tab);
        // Send car details to the background script
        // add the tabId to the messages
        chrome.runtime.sendMessage({ action: "carDetailsExtracted", carDetails: car});
      } else {
        console.log('No car details found');
      }
  }
});


/**
 * Extract car details from the page using strategies for different websites.
 */
function extractCarDetails(): ICarDetails {
  const carDetails: ICarDetails = {
    url: window.location.href,
  };

  const strategies: { [key: string]: () => void } = {
    "autotrader.ca": () => {
      autoTraderStrategy(carDetails);
    },
    "default": () => {
      defaultStrategy(carDetails);
    },
  };

  // Determine the strategy based on the current domain
  const domain = new URL(window.location.href).hostname.replace("www.", "");
  const strategy = strategies[domain] || strategies["default"];
  strategy();

  return carDetails;
}

