
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config({ path: ".env.local" });

async function listModels() {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    fs.writeFileSync("available_models.json", JSON.stringify(data, null, 2));
}

listModels();
