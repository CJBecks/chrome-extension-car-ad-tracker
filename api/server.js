import express from "express";
import cors from "cors";
import { pipeline } from "@xenova/transformers";

const app = express();
app.use(cors()); 
app.use(express.json()); 

let nerPipeline;

// Load AI model at startup
(async () => {
    console.log("Loading model...");
    nerPipeline = await pipeline("ner", "Xenova/bert-base-NER");
    console.log("Model loaded!");
})();

// Helper function to map extracted data to ICarDetails
function extractCarDetails(text, entities) {
    const carDetails = {
        make: undefined,
        model: undefined,
        year: undefined,
        price: undefined,
        url: "https://example.com/listing", // Placeholder URL
        dateListed: new Date().toISOString(),
        daysOnMarket: 0, 
    };

    console.log("Entities detected:", entities);

    // Process detected entities
    for (const entity of entities) {
        const { word, entity_group } = entity;

        if (entity_group === "MISC" && /^\d{4}$/.test(word)) {
            carDetails.year = word; // Capture year
        } else if (entity_group === "ORG" || entity_group === "MISC") {
            if (!carDetails.make) {
                carDetails.make = word; // Likely the car brand
            } else if (!carDetails.model) {
                carDetails.model = word; // Likely the model
            }
        } 
        // else if (entity_group === "MONEY" || word.startsWith("$")) {
        //     carDetails.price = word.replace(/[^\d]/g, ""); // Extract price digits
        // }
    }

    return carDetails;
}

// Fallback function to extract car details using regex
function extractCarDetailsWithRegex(text) {
    const carDetails = {
        make: undefined,
        model: undefined,
        year: undefined,
        price: undefined,
        url: "https://example.com/listing", // Placeholder URL
        dateListed: new Date().toISOString(),
        daysOnMarket: 0,
    };

    // Regex patterns for make, model, and price
    const priceMatch = text.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    const makeModelMatch = text.match(/(\w+)\s+(\w+)\s+for\s+sale/i);

    if (priceMatch) {
        carDetails.price = priceMatch[1].replace(/,/g, ""); // Extract price digits
    }
    if (makeModelMatch) {
        carDetails.make = makeModelMatch[1]; // Extract make
        carDetails.model = makeModelMatch[2]; // Extract model
    }

    return carDetails;
}

// API route to extract car details
app.post("/extract-car", async (req, res) => {
    try {
        const { text } = req.body;

        let carDetails;
        if (nerPipeline) {
            const entities = await nerPipeline(text);
            carDetails = extractCarDetails(text, entities);
        } else {
            console.warn("NER model not loaded, using regex fallback.");
            carDetails = extractCarDetailsWithRegex(text);
        }

        res.json(carDetails);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
