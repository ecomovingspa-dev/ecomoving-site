
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function listModels() {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        console.error("API KEY MISSING");
        return;
    }

    const versions = ["v1", "v1beta"];
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    for (const v of versions) {
        console.log(`\n=== TESTING API VERSION: ${v} ===`);
        const genAI = new GoogleGenerativeAI(API_KEY, { apiVersion: v });
        for (const m of models) {
            process.stdout.write(`Testing ${m}... `);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("Hi");
                console.log(`SUCCESS`);
            } catch (err) {
                console.log(`FAILED: ${err.message.substring(0, 100)}`);
            }
        }
    }
}

listModels();
