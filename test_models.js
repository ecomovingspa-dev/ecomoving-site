
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function listModels() {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        console.error("API KEY MISSING");
        return;
    }
    const genAI = new GoogleGenerativeAI(API_KEY);
    try {
        // We can't directly list models from the SDK easily in some versions without the manager
        // but we can try to initialize one and see if it fails early or check the docs naming.
        const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-1.5-pro-latest", "gemini-pro", "gemini-2.0-flash-exp"];
        for (const m of models) {
            console.log(`Testing ${m}...`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("Hi");
                console.log(`Success with ${m}`);
            } catch (err) {
                console.error(`Failed with ${m}:`, err.message);
            }
        }
    } catch (e) {
        console.error("An unexpected error occurred:", e.message);
    }
}

listModels();
