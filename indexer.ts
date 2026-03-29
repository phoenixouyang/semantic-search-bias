import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const baseURL: string = 'https://openrouter.ai/api/v1';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, './.env'),
    quiet: true
});

const { OPENROUTER_API_KEY } = process.env;

const openai = new OpenAI({
  baseURL: baseURL,
  apiKey: OPENROUTER_API_KEY,
});

interface Career {
    title: string;
}

async function main(): Promise<void> {
    // check for openrouter api key
    if (!OPENROUTER_API_KEY) {
        console.error(`Missing API Key: OPENROUTER_API_KEY`);
        process.exit(1);
    }

    // Load and parse the JSON file
    const jsonPath = path.resolve(__dirname, 'data.json');
    const data: Career[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`Loaded ${data.length} data titles from JSON.`);

    // Extract titles as input strings for the embedding model
    const input: string[] = data.map((d) => d.title);

    const response = await openai.embeddings.create({
        model: 'google/gemini-embedding-001',
        input,
        encoding_format: 'float'
    });
    
    const dataEmbeddings = response.data.map((d) => d.embedding);
    const vectors = dataEmbeddings.map((vector) => vector.join('\t')).join('\n');
    fs.writeFileSync('vectors.tsv', vectors);
    console.log("Vectors saved to file: vectors.tsv");

    const metadataLines: string[] = [];
    data.forEach((d: Career) => {
        const title = d.title.replace(/\t|\n/g, ' ');
        metadataLines.push(title);
    });
    fs.writeFileSync('metadata.tsv', metadataLines.join('\n'));
    console.log("Metadata saved to file: metadata.tsv");
}

main();