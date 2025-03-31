import express from "express";
import cors from "cors";
import { pipeline } from "@xenova/transformers";

const app = express();
app.use(cors());
app.use(express.json());

let nerPipeline;

// Load the model on server startup
(async () => {
    console.log("Loading model...");
    nerPipeline = await pipeline("ner", "Xenova/bert-base-NER");
    console.log("Model loaded!");
})();

app.post("/ner", async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    try {
        const result = await nerPipeline(text);
        res.json(result);
    } catch (error) {
        console.error("Error processing text:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
