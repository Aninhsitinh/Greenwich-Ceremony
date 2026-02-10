
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = process.env.VITE_GEMINI_API_KEY;

console.log('--- Gemini Connectivity Test ---');
console.log('API Key present:', !!apiKey);

async function testGemini() {
    if (!apiKey) {
        console.error('❌ No API Key found');
        return;
    }

    try {
        console.log('Testing Model: gemini-2.0-flash-exp');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const prompt = "Hello! Are you working correctly? Please reply with 'Yes, I am Gemini 2.0'.";
        console.log(`Sending prompt: "${prompt}"`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('\n✅ SUCCESS! Response received:');
        console.log('--------------------------------------------------');
        console.log(text);
        console.log('--------------------------------------------------');
    } catch (error) {
        console.error('\n❌ TEST FAILED:');
        console.error(error);
    }
}

testGemini();
