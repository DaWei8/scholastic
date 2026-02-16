import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { userId, facultyId, resumeText } = await req.json();

        if (!userId || !facultyId || !resumeText) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Fetch Faculty data
        const { data: faculty, error: fError } = await supabase
            .from('faculty')
            .select('*')
            .eq('id', facultyId)
            .single();

        if (fError || !faculty) {
            throw new Error("Faculty not found");
        }

        // 2. Generate Match Explanation and Outreach Email using Gemini
        const prompt = `
            You are an AI research assistant helping a student connect with a faculty member.
            
            Student Research Profile:
            ${resumeText}
            
            Faculty Profile:
            Name: ${faculty.name}
            Institution: ${faculty.institution}
            Interests: ${faculty.research_interests.join(", ")}
            Bio: ${faculty.bio_summary}
            
            Please provide:
            1. A brief "Match Explanation" (2-3 sentences) explaining why the student and faculty are a good research match.
            2. A professional, personalized outreach email from the student to the faculty member. The email should be concise, mention specific shared interests, and ask about potential research opportunities.
            
            Return the result in JSON format:
            {
                "explanation": "...",
                "emailBody": "..."
            }
        `;

        const responseText = await generateContent(prompt);

        // Clean up JSON if necessary (Gemini sometimes adds markdown blocks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);

        // 3. Update Interaction with explanation
        await supabase
            .from('interactions')
            .update({
                match_explanation: data.explanation,
                status: 'shortlisted'
            })
            .match({ user_id: userId, faculty_id: facultyId });

        // 4. Create Outreach Log entry
        // First get the interaction ID
        const { data: interaction } = await supabase
            .from('interactions')
            .select('id')
            .match({ user_id: userId, faculty_id: facultyId })
            .single();

        if (interaction) {
            await supabase
                .from('outreach_logs')
                .insert({
                    interaction_id: interaction.id,
                    email_body: data.emailBody,
                    status: 'draft'
                });
        }

        return NextResponse.json({
            success: true,
            explanation: data.explanation,
            emailBody: data.emailBody
        });

    } catch (error: unknown) {
        console.error('Outreach Generation Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
