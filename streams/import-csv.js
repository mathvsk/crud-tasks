import { parse } from 'csv-parse';
import fs from 'node:fs';

const SERVER_URL = 'http://localhost:3000/tasks';
const CSV_FILE_PATH = new URL('./tasks.csv', import.meta.url);

async function readCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        const lines = [];
        const stream = fs.createReadStream(filePath);

        stream
            .on('error', reject)
            .pipe(parse({ delimiter: ',', skipEmptyLines: true, fromLine: 2 }))
            .on('data', (line) => lines.push(line))
            .on('end', () => resolve(lines))
            .on('error', reject);
    });
}

async function sendDataToServer(data) {
    const promises = data.map(async ([title, description]) => {
        try {
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) {
                throw new Error(`Failed to send data: ${response.statusText}, ${response.status}`);
            }

            console.log(`Data sent successfully: ${title}`);
            return { success: true };
        } catch (error) {
            console.error(`Failed to send data: ${error.message}, Title: ${title}`);
            return { success: false, error: error.message };
        }
    });

    await Promise.all(promises);
    console.log('All requests processed.');
}

async function main() {
    try {
        const data = await readCSVFile(CSV_FILE_PATH);
        await sendDataToServer(data);
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
}

await main();