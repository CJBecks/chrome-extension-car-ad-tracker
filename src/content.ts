import { extractAiStrategy } from "./extractionStrategies/ai";
// import { autoTraderStrategy } from "./extractionStrategies/autotrader";
// import { defaultStrategy } from "./extractionStrategies/default";

export interface ICarDetails {
  /**
   * The make of the car (e.g., "Toyota").
   */
  make?: string;

  /**
   * The model of the car (e.g., "Camry").
   */
  model?: string;

  /**
   * The year of the car (e.g., "2020").
   */
  year?: string;

  /**
   * The price of the car (e.g., 25000).
   * This is a number without currency symbols.
   */
  price?: number;

  /**
   * The URL of the car listing.
   */
  url: string;

  /**
   * The date the car was listed (e.g., "2023-10-01").
   * This is a string in ISO format.
   */
  dateListed?: string;

  /**
   * The number of days the car has been on the market.
   * This is a number representing the count of days.
   */
  daysOnMarket?: number;
}

/**
 * Listen for messages from the background script.
 */
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "extractCarDetails") {
      const car = await extractCarDetails();

      if (car.make) {
        // Send car details to the background scriptS
        chrome.runtime.sendMessage({ action: "carDetailsExtracted", carDetails: car});
      }
  }
});


/**
 * Extract car details from the page using strategies for different websites.
 */
async function extractCarDetails(): Promise<ICarDetails> {
  const carDetails: ICarDetails = {
    url: window.location.href,
  };

  console.debug("Extracting car details from:", carDetails.url);

const strategies: { [key: string]: () => Promise<void> } = {
  "ai": async () => {
    await extractAiStrategy(carDetails);
  },
  "autotrader.ca": async () => {
    await extractAiStrategy(carDetails);
  },
  "default": async () => {
    await extractAiStrategy(carDetails);
  },
};


  // Determine the strategy based on the current domain
  const domain = new URL(window.location.href).hostname.replace("www.", "");
  const strategy = strategies[domain] || strategies["default"];
  await strategy();

  console.debug("Extracted car details:", carDetails);
  
  return carDetails;
}

