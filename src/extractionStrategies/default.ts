import { ICarDetails } from "../content";

export function defaultStrategy(carDetails: ICarDetails) {
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
  
    // const priceElement = document.querySelector(".english-price");
    const dateListedElement = document.querySelector(".car-date-listed-selector");
  
    // carDetails.price =
    //   (priceElement as HTMLElement)?.innerText || undefined;
    carDetails.dateListed =
      (dateListedElement as HTMLElement)?.innerText || undefined;
  }