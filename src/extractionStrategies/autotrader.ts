import { ICarDetails } from "../content";

export function autoTraderStrategy(carDetails: ICarDetails) {
    const headingElement = document.querySelector(".hero-title");
  
    if (headingElement) {
      const headingText = (headingElement as HTMLElement).innerText;
      const yearMatch = headingText.match(/\b\d{4}\b/);
      carDetails.year = yearMatch ? yearMatch[0] : undefined;
    }
  
    const urlParts = new URL(window.location.href).pathname.split('/');
    if (urlParts.length >= 3) {
      const make = urlParts[2]?.trim();
      carDetails.make = make ? make.charAt(0).toUpperCase() + make.slice(1) : undefined;

      const rawModel = urlParts[3];
      
      const headingText = (headingElement as HTMLElement)?.innerText || '';
      if (carDetails.make && rawModel) {
        const modelRegex = new RegExp(`${carDetails.make}\\s+(.*${rawModel}.*)`, 'i');
        const modelMatch = headingText.match(modelRegex);
        const extractedModel = modelMatch ? modelMatch[1].trim() : rawModel;
        carDetails.model = extractedModel.length > 35 ? extractedModel.slice(0, 32) + "..." : extractedModel;
      } else {
        carDetails.model = rawModel.length > 35 ? rawModel.slice(0, 32) + "..." : rawModel;
      }
    }
  
    const priceElement = document.querySelector(".hero-price");
    carDetails.price =
      (priceElement as HTMLElement)?.innerText || undefined;
  }