import { readFile } from 'fs/promises';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

/*
* This function calculates the dot product of two number arrays to determine their similarity scores
* @params: two array of numbers 
* @returns: a number representing their similarity
*/
export function dotProduct(vecA: number[], vecB: number[]): number {
  return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
}

/*
* Combines Career information with vectors
* @returns: an array of Careers with params: career and embedding
*/
export async function loadDatabase(): Promise<any[]> {
  // 1. Read the JSON file
  const careersData = await readFile('data.json', 'utf-8');
  const careers = JSON.parse(careersData);

  // 2. Read the TSV file
  const vectorsData = await readFile('vectors.tsv', 'utf-8');
  const lines = vectorsData.trim().split('\n');

  // 3. Attach vectors to products
  // We assume Line 0 of vectors.tsv matches products[0]
  const careersWithEmbeddings = careers.map((career: any, index: number) => {
    const vectorString = lines[index];
    // Convert tab-separated values to a list of float numbers
    const vector = vectorString.split('\t').map(Number);
    return { ...career, embedding: vector };
  });

  return careersWithEmbeddings;
}

/*
* helper function to call openrouter to embed the received query
* @returns: the embeddings for the query
*/
async function embedQuery(query: string): Promise<any[]> {
    const __filename: string = fileURLToPath(import.meta.url);
    const __dirname: string = path.dirname(__filename);

    dotenv.config({
        path: path.resolve(__dirname, './.env'),
        quiet: true
    });
    
    const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY
    });

    const queryResponse = await openai.embeddings.create({
        model: 'google/gemini-embedding-001',
        input: query,
        encoding_format: 'float'
    });
    const queryEmbedding = queryResponse.data[0].embedding;
    
    return queryEmbedding;
}

/*
* Searches for careers inside the products.json file to find top 5 similar results
* @params query: the string you want to search for
* @params products: an array of careers and their embeddings
* @params minScore: the minimum number that determines whether the dot product is a 'good match'
* @returns: a string delimited by '|' of the product properties
*/
export async function searchCareers(
    query: string,
    careers: any[],
    minScore: number = 0 // Replace with your discovered number
): Promise<any[]> {
    const queryEmbedding = await embedQuery(query);

    // Calculate dot product of query embedding and all product embeddings
    const results = careers.map((career) => ({
        career,
        similarity: dotProduct(queryEmbedding, career.embedding)
    }));

    results.sort((a, b) => b.similarity - a.similarity);

    var matches = results.filter(career => career.similarity >= minScore);
    
    return matches;
}