import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!supabaseUrl || !supabaseAnonKey || !geminiKey) {
    console.error("Missing environment variables. Please check .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * Generate an embedding using Gemini gemini-embedding-001 via REST API.
 * Returns a 3072-dimensional vector.
 */
async function embedContent(text) {
    const res = await fetch(
        `${BASE_URL}/gemini-embedding-001:embedContent?key=${geminiKey}`,
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

const facultyData = [
    {
        name: "Dr. Elena Rodriguez",
        institution: "Stanford University",
        department: "Computer Science",
        email: "elena.r@stanford.edu",
        bio_summary: "Research focuses on deep learning and its applications in healthcare, specifically analyzing medical images for early cancer detection. Leading the Stanford AI-Health lab.",
        research_interests: ["AI", "Healthcare", "Computer Vision", "Deep Learning"],
        website_url: "https://example.edu/elena",
        is_accepting_students: true,
    },
    {
        name: "Prof. James Wilson",
        institution: "MIT",
        department: "Physics",
        email: "jwilson@mit.edu",
        bio_summary: "Specialist in quantum computing and error correction algorithms. Author of several papers on scalable quantum architectures and topological qubits.",
        research_interests: ["Quantum Computing", "Algorithms", "Physics", "Quantum Error Correction"],
        website_url: "https://example.edu/james",
        is_accepting_students: true,
    },
    {
        name: "Dr. Sarah Chen",
        institution: "UC Berkeley",
        department: "Electrical Engineering",
        email: "schen@berkeley.edu",
        bio_summary: "Pioneer in renewable energy systems and smart grid optimization using decentralized consensus mechanisms and machine learning for load prediction.",
        research_interests: ["Sustainability", "Power Systems", "Blockchain", "Machine Learning"],
        website_url: "https://example.edu/sarah",
        is_accepting_students: true,
    },
    {
        name: "Prof. Marcus Thorne",
        institution: "Carnegie Mellon University",
        department: "Robotics Institute",
        email: "mthorne@cmu.edu",
        bio_summary: "Focusing on human-robot interaction and agile locomotion. Researching how robots can learn from human demonstrations in unpredictable environments.",
        research_interests: ["Robotics", "HRI", "Reinforcement Learning", "Control Systems"],
        website_url: "https://example.edu/marcus",
        is_accepting_students: true,
    },
    {
        name: "Dr. Anya Volkov",
        institution: "Oxford University",
        department: "Mathematical Institute",
        email: "anya.v@ox.ac.uk",
        bio_summary: "Deep research into the foundations of neural networks and gradient flow. Exploring the intersection of algebraic geometry and statistical learning theory.",
        research_interests: ["Mathematics", "AI Theory", "Neural Networks", "Geometry"],
        website_url: "https://example.edu/anya",
        is_accepting_students: true,
    }
];

async function seed() {
    console.log("Starting faculty seeding...");

    for (const faculty of facultyData) {
        console.log(`Generating embedding for ${faculty.name}...`);
        
        // Combine fields for better embedding quality
        const textToEmbed = `${faculty.name} is a faculty at ${faculty.institution} in the ${faculty.department} department. ${faculty.bio_summary} Interests: ${faculty.research_interests.join(", ")}`;
        
        const embedding = await embedContent(textToEmbed);

        const { error } = await supabase
            .from('faculty')
            .insert({
                ...faculty,
                embedding: embedding
            });

        if (error) {
            console.error(`Error inserting ${faculty.name}:`, error.message);
        } else {
            console.log(`Successfully seeded ${faculty.name}`);
        }
    }

    console.log("Seeding complete!");
}

seed();
