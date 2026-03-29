import { loadDatabase, searchCareers } from "./utils.ts";
import readline from "readline";
import fs from 'fs';

const minScore = 0

function prompt(question: string): Promise<string> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function main(): Promise<void> {
    const careers = await loadDatabase();
    var keepSearching = true;
    const csvRows: string[] = [];

    do {
        const searchQuery = await prompt("Enter a search query to see top matching careers. Enter '0' to exit search:\n");

        if (searchQuery.trim() == "") {
            console.log("Search query cannot be blank.")
        } else if (searchQuery == "0") {
            keepSearching = false;
        } else {
            const matches = await searchCareers(searchQuery, careers, minScore);
            if (matches.length < 1) {
                console.log("Sorry, we don't have anything like that in stock.");
            }
            else {
                console.log(`Found ${matches.length} matches:`);

                // Build CSV block for this query
                csvRows.push(`${searchQuery}`);
                csvRows.push(`Score,Title`);
                matches.forEach((match, index) => {
                    console.log(`${index + 1}. [Score: ${match.similarity.toFixed(2)}] ${match.career.title}`);
                    csvRows.push(`${match.similarity.toFixed(2)},${match.career.title}`);
                });
                csvRows.push(''); // blank line between queries
            }
        }
        console.log();
    } while (keepSearching);

    // Save to CSV
    if (csvRows.length > 0) {
        fs.writeFileSync('search_results.csv', csvRows.join('\n'));
        console.log("Search results saved to: search_results.csv");
    }

    console.log("Thank you for searching!");
}

main();