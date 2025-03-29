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
 * Extract car details from the page.
 * 
 * This only works for some websites!
 */
function extractCarDetails(): ICarDetails {
  const carDetails: ICarDetails = {
    url: window.location.href,
  };

  const headingElement = document.querySelector(".heading-year-make-model");
  if (headingElement) {
    carDetails.year =
      (
        headingElement.querySelector('[itemprop="releaseDate"]') as HTMLElement
      )?.innerText.trim() || undefined;
    carDetails.make =
      (
        headingElement.querySelector('[itemprop="manufacturer"]') as HTMLElement
      )?.innerText.trim() || undefined;
    carDetails.model =
      (
        headingElement.querySelector('[itemprop="model"] var') as HTMLElement
      )?.innerText.trim() || undefined;
  }

  const priceElement = document.querySelector(".english-price");
  const dateListedElement = document.querySelector(".car-date-listed-selector");

  carDetails.price =
    (priceElement as HTMLElement)?.innerText || undefined;
  carDetails.dateListed =
    (dateListedElement as HTMLElement)?.innerText || undefined;

  return carDetails;
}
