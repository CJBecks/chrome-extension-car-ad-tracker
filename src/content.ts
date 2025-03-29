export interface ICarDetails {
  make?: string;
  model?: string;
  year?: string;
  price?: string;
  url: string;
  dateListed?: string;
  daysOnMarket?: number;
}

const carDetails: ICarDetails = {
  url: window.location.href,
};

// TODO: Extract from DOM
function extractCarDetails() {
  console.log("Extracting car details...");

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
    (priceElement as HTMLElement)?.innerText || "Unknown Price";
  carDetails.dateListed =
    (dateListedElement as HTMLElement)?.innerText || "Unknown Date";

  console.log("Extracted Car Details:", carDetails);
}

extractCarDetails();
