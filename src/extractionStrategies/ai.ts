import { ICarDetails } from '../content';

export async function extractAiStrategy(carDetails: ICarDetails) {
    // const ner = await pipeline('ner', 'Xenova/bert-base-NER'); // Load NER model
    const pageText = getPageText(); // Use getPageText function
    //const entities = await ner(pageText);
    
    // console.log('Extracted Entities:', pageText, carDetails);
    chrome.runtime.sendMessage({ action: "ai", pageText: pageText, carDetails: carDetails});
}

function getPageText() {
    const elements = document.querySelectorAll("h1, h2, h3, p, span, div");
    return Array.from(elements)
        .map(el => (el as HTMLElement).innerText.trim())
        .filter(text => text.length > 5) // Remove short or empty strings
        .join("\n");
}