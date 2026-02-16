import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Use gemini-1.5-flash for summaries and drafting
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Use text-embedding-004 for vectorization
export const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

export default genAI;
