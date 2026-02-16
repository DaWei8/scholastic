const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
}

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export async function generateContent(prompt: string): Promise<string> {
    const res = await fetch(
        `${BASE_URL}/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.1,
                    topP: 0.95,
                    topK: 40,
                },
            }),
        }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini generateContent error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function embedContent(text: string): Promise<number[]> {
    const res = await fetch(
        `${BASE_URL}/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: { parts: [{ text }] },
            }),
        }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini embedContent error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return data.embedding?.values ?? [];
}