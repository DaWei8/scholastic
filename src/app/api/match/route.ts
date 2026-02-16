import { NextResponse } from 'next/server';
import { embeddingModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { resumeText } = await req.json();

        if (!resumeText) {
            return NextResponse.json({ error: "Resume text is required" }, { status: 400 });
        }

        // 1. Generate embedding using Gemini text-embedding-004
        // This model outputs a 768-dimensional vector
        const result = await embeddingModel.embedContent(resumeText);
        const embedding = result.embedding.values;

        // 2. Query Supabase via RPC
        // match_faculty(query_embedding vector(768), match_threshold float, match_count int)
        const { data: matches, error } = await supabase.rpc('match_faculty', {
            query_embedding: embedding,
            match_threshold: 0.3, // Lower threshold to get more potential matches
            match_count: 15,      // Return top 15 results
        });

        if (error) {
            console.error('Supabase RPC error:', error);
            throw new Error(error.message);
        }

        // 3. Return matches to the client
        return NextResponse.json({
            success: true,
            matches
        });

    } catch (error: any) {
        console.error('AI Matching Route Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
