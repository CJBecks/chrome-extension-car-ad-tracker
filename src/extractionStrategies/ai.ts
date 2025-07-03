import { ICarDetails } from '../content';

export async function extractAiStrategy(carDetails: ICarDetails) {
    const pageText = getPageText(); // Use getPageText function

    carDetails.url = window.location.href;

    try {
        const response = await fetch('http://localhost:3000/parse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input: pageText, carDetails })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        const carDetailsParsed = parseAIJson(result.parsed);
        console.debug('🚗 Parsed Car Details:', carDetailsParsed);

        if (carDetailsParsed) {
            Object.assign(carDetails, carDetailsParsed);
        }
    } catch (err) {
        console.error('❌ Failed to fetch from local AI parser:', err);
    }
}

function getPageText() {
    const elements = document.querySelectorAll("h1, h2, h3, p, span, div");
    return Array.from(elements)
        .map(el => (el as HTMLElement).innerText.trim())
        .filter(text => text.length > 5) // Remove short or empty strings
        .join("\n");
}

function parseAIJson(parsed: ICarDetails): ICarDetails | null {
    try {
        // // Step 1: Strip ```json and ```
        // const cleaned = raw
        //     .replace(/^```json\s*/i, '')  // remove leading ```json
        //     .replace(/```$/, '')          // remove trailing ```
        //     .trim();

        // // Step 2: Parse it
        // const parsed = JSON.parse(cleaned);

        // Step 3: Optionally coerce into ICarDetails shape
        const carDetails: ICarDetails = {
            make: parsed.make,
            model: parsed.model,
            year: parsed.year?.toString?.(),
            price: parsed.price,
            url: window.location.href,
            dateListed: parsed.dateListed,
            daysOnMarket: typeof parsed.daysOnMarket === 'number' ? parsed.daysOnMarket : undefined
        };

        return carDetails;
    } catch (err) {
        console.error('❌ Failed to parse AI JSON:', err);
        return null;
    }
}
