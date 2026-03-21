
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config({ path: ".env.local" });

async function listModels() {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    let log = "";
    if (!API_KEY) {
        log += "API KEY MISSING\n";
        fs.writeFileSync("test_results.txt", log);
        return;
    }

    const versions = ["v1", "v1beta"];
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    for (const v of versions) {
        log += `\n=== TESTING API VERSION: ${v} ===\n`;
        const genAI = new GoogleGenerativeAI(API_KEY, { apiVersion: v });
        for (const m of models) {
            log += `Testing ${m}... `;
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("Hi");
                log += `SUCCESS\n`;
            } catch (err) {
                log += `FAILED: ${err.message}\n`;
            }
        }
    }
    fs.writeFileSync("test_results.txt", log);
    console.log("Done. Results in test_results.txt");
}

listModels();
