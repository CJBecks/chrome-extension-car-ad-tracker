import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';


const app = express();
const port = 3000;

app.use(cors({
    origin: '*', // or restrict to: chrome-extension://<your-extension-id>
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Ollama Parser API is running!');
});

app.post('/parse', async (req, res) => {
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({ error: 'Missing input string.' });
    }

    try {
        const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
            model: 'qwen2.5-coder:7b',
            prompt: `You are an AI car ad parser.

                Extract structured vehicle information from the following HTML/text. Return ONLY a JSON object matching this TypeScript interface:

                Strickly follow this JSON interface:

                export interface ICarDetails {
                    /**
                     * The make of the car (e.g., "Toyota").
                     */
                    make: string;

                    /**
                     * The model of the car (e.g., "Camry").
                     */
                    model: string;

                    /**
                     * The year of the car (e.g., "2020").
                     */
                    year: string;

                    /**
                     * The price of the car (e.g., 25000).
                     * This is a number without currency symbols.
                     */
                    price: number;

                    /**
                     * The URL of the car listing.
                     */
                    url: string;

                    /**
                     * The date the car was listed (e.g., "2023-10-01").
                     * This is a string in ISO format.
                     */
                    dateListed: string;

                    /**
                     * The number of days the car has been on the market.
                     * This is a number representing the count of days.
                     */
                    daysOnMarket: number;
                }

                Here is the input content:

                "${input}"

                Use best effort to infer missing fields but . If a value isn't found, omit the property entirely. Do not explain — only return JSON.
                `,
            stream: false,
        });

        console.debug('Ollama response:', ollamaResponse.data.response);


        // Step 1: Strip ```json and ```
        const cleaned = ollamaResponse.data.response
            .replace(/^```json\s*/i, '')  // remove leading ```json
            .replace(/```$/, '')          // remove trailing ```
            .trim();

        // Step 2: Parse it
        const parsed = JSON.parse(cleaned);

        console.debug('Parsed JSON:', parsed);

        res.json({ parsed: parsed });
    } catch (err) {
        console.error('Error talking to Ollama:', err.message);
        res.status(500).json({ error: 'Failed to connect to Ollama.' });
    }
});

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
