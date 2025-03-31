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
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "extractCarDetails") {
      const car = extractCarDetails();

      if (car.make) {
        // Send car details to the background scriptS
        chrome.runtime.sendMessage({ action: "carDetailsExtracted", carDetails: car});
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

