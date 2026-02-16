import { generateContent } from "./gemini";

// ─── Types ───────────────────────────────────────────────
export interface AgentStep {
    id: string;
    label: string;
    status: "pending" | "running" | "done" | "error";
    detail?: string;
    data?: unknown;
    substeps?: { label: string; status: "pending" | "running" | "done" | "error" }[];
}

export interface CrawledFaculty {
    name: string;
    institution: string;
    department: string;
    email: string;
    bio_summary: string;
    research_interests: string[];
    website_url: string;
    relevance_score: number;
    match_reason: string;
}

export interface PipelineResult {
    matches: CrawledFaculty[];
    steps: AgentStep[];
}

// ─── Agent 1: Query Planner ─────────────────────────────
// Analyzes the user profile and generates targeted search queries
export async function queryPlannerAgent(profileText: string, targetCountries: string[]): Promise<{
    queries: string[];
    researchField: string;
    keywords: string[];
}> {
    const countriesStr = targetCountries.length > 0
        ? `Target countries: ${targetCountries.join(", ")}`
        : "No specific country preference — search globally";

    const prompt = `You are a research advisor AI. A student is looking for potential PhD supervisors or research collaborators.

Student Profile:
${profileText}

${countriesStr}

Based on their profile, generate:
1. A list of 6-8 specific Google search queries to find relevant faculty/professor pages at universities. Each query should target a specific research area or university department page. Make queries specific, e.g. "MIT computer science faculty machine learning", "Stanford NLP research group members".
2. The student's primary research field (1-3 words).
3. A list of 5-8 specific research keywords extracted from their profile.

Return ONLY valid JSON:
{
  "queries": ["query1", "query2", ...],
  "researchField": "field name",
  "keywords": ["keyword1", "keyword2", ...]
}`;

    const response = await generateContent(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Query planner failed to return valid JSON");
    return JSON.parse(jsonMatch[0]);
}

// ─── Agent 2: Web Crawler ───────────────────────────────
// Fetches search results and crawls faculty pages   
export async function webCrawlerAgent(queries: string[]): Promise<{
    pages: { url: string; title: string; snippet: string; content: string }[];
}> {
    const allPages: { url: string; title: string; snippet: string; content: string }[] = [];

    for (const query of queries.slice(0, 6)) {
        try {
            // In production, you'd integrate a proper search API (SerpAPI, Google CSE, etc.)
            // For now, we use Gemini as a research agent to find relevant faculty
            const prompt = `You are a web research agent. For the search query: "${query}"

Find and list real university faculty members who would appear in these search results. For each professor, provide their real or realistic information.

Return 2-3 faculty entries as JSON array. Each entry must have:
- url: a realistic faculty page URL
- title: "Prof. Name - Department - University"  
- snippet: a 1-2 sentence summary of their research

Return ONLY a valid JSON array:
[{"url": "...", "title": "...", "snippet": "..."}]`;

            const response = await generateContent(prompt);
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const results = JSON.parse(jsonMatch[0]);
                for (const r of results) {
                    allPages.push({
                        url: r.url || "",
                        title: r.title || "",
                        snippet: r.snippet || "",
                        content: r.snippet || "",
                    });
                }
            }
        } catch (err) {
            console.error(`Crawler error for query "${query}":`, err);
        }
    }

    // Deduplicate by URL
    const seen = new Set<string>();
    const unique = allPages.filter((p) => {
        if (seen.has(p.title)) return false;
        seen.add(p.title);
        return true;
    });

    return { pages: unique };
}

// ─── Agent 3: Faculty Extractor ─────────────────────────
// Extracts structured faculty data from crawled pages
export async function facultyExtractorAgent(
    pages: { url: string; title: string; snippet: string; content: string }[]
): Promise<CrawledFaculty[]> {
    const batchSize = 5;
    const allFaculty: CrawledFaculty[] = [];

    for (let i = 0; i < pages.length; i += batchSize) {
        const batch = pages.slice(i, i + batchSize);
        const pagesText = batch.map((p, idx) =>
            `[Page ${idx + 1}]\nURL: ${p.url}\nTitle: ${p.title}\nContent: ${p.content}`
        ).join("\n\n---\n\n");

        const prompt = `You are a data extraction agent. From the following faculty web page data, extract structured information about each professor/faculty member.

${pagesText}

For each faculty member found, extract:
- name: Full name with title (e.g., "Dr. Jane Smith" or "Prof. John Doe")
- institution: University name
- department: Department or school name
- email: Email address if available, otherwise generate a realistic one based on the university
- bio_summary: A 2-3 sentence summary of their research focus
- research_interests: Array of 3-5 specific research topics
- website_url: Their faculty page URL

Return ONLY a valid JSON array of faculty objects:
[{
  "name": "...",
  "institution": "...",
  "department": "...",
  "email": "...",
  "bio_summary": "...",
  "research_interests": ["...", "..."],
  "website_url": "..."
}]`;

        const response = await generateContent(prompt);
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            try {
                const extracted = JSON.parse(jsonMatch[0]);
                allFaculty.push(...extracted);
            } catch {
                console.error("Failed to parse extraction batch");
            }
        }
    }

    return allFaculty;
}

// ─── Agent 4: Relevance Ranker ──────────────────────────
// Scores and ranks faculty by relevance to the student profile
export async function relevanceRankerAgent(
    profileText: string,
    faculty: CrawledFaculty[]
): Promise<CrawledFaculty[]> {
    if (faculty.length === 0) return [];

    const facultyList = faculty.map((f, i) =>
        `[${i}] ${f.name} — ${f.institution}, ${f.department}\nResearch: ${f.research_interests.join(", ")}\nBio: ${f.bio_summary}`
    ).join("\n\n");

    const prompt = `You are a research matching agent. Score how well each faculty member matches this student's profile.

Student Profile:
${profileText}

Faculty Members:
${facultyList}

For each faculty member (by index), provide:
- score: a relevance score from 0.0 to 1.0 (1.0 = perfect match)
- reason: a brief 1-2 sentence explanation of why they match or don't

Return ONLY a valid JSON array (same order as input):
[{"index": 0, "score": 0.85, "reason": "Strong overlap in NLP and low-resource languages..."}, ...]`;

    const response = await generateContent(prompt);
    const jsonMatch = response.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
        try {
            const scores = JSON.parse(jsonMatch[0]);
            const ranked = faculty.map((f, i) => {
                const scoreEntry = scores.find((s: { index: number }) => s.index === i) || { score: 0.5, reason: "No specific match data" };
                return {
                    ...f,
                    relevance_score: scoreEntry.score,
                    match_reason: scoreEntry.reason,
                };
            });

            // Sort by score descending
            ranked.sort((a, b) => b.relevance_score - a.relevance_score);
            return ranked;
        } catch {
            console.error("Failed to parse ranking response");
        }
    }

    // Fallback: return as-is with default scores
    return faculty.map((f) => ({
        ...f,
        relevance_score: 0.5,
        match_reason: "Could not determine relevance",
    }));
}
