import { NextRequest } from "next/server";
import {
    queryPlannerAgent,
    webCrawlerAgent,
    facultyExtractorAgent,
    relevanceRankerAgent,
} from "@/lib/agents";

// Stream progress updates to the client via SSE
function sendEvent(controller: ReadableStreamDefaultController, event: string, data: unknown) {
    const encoder = new TextEncoder();
    controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
}

export async function POST(req: NextRequest) {
    const { profileText, targetCountries = [] } = await req.json();

    if (!profileText) {
        return new Response(JSON.stringify({ error: "Profile text is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const stream = new ReadableStream({
        async start(controller) {
            try {
                // ─── Step 1: Query Planner Agent ────────────────
                sendEvent(controller, "step", {
                    id: "query-planner",
                    label: "Analyzing your profile",
                    status: "running",
                    detail: "Understanding your research interests and generating search strategies...",
                });

                const queryPlan = await queryPlannerAgent(profileText, targetCountries);

                sendEvent(controller, "step", {
                    id: "query-planner",
                    label: "Analyzing your profile",
                    status: "done",
                    detail: `Identified field: ${queryPlan.researchField}. Generated ${queryPlan.queries.length} search strategies.`,
                    data: {
                        researchField: queryPlan.researchField,
                        keywords: queryPlan.keywords,
                        queryCount: queryPlan.queries.length,
                    },
                });

                // ─── Step 2: Web Crawler Agent ──────────────────
                sendEvent(controller, "step", {
                    id: "web-crawler",
                    label: "Searching university websites",
                    status: "running",
                    detail: `Crawling ${queryPlan.queries.length} search queries across university faculty pages...`,
                    substeps: queryPlan.queries.slice(0, 6).map((q: string) => ({
                        label: q,
                        status: "running",
                    })),
                });

                const crawlResult = await webCrawlerAgent(queryPlan.queries);

                sendEvent(controller, "step", {
                    id: "web-crawler",
                    label: "Searching university websites",
                    status: "done",
                    detail: `Found ${crawlResult.pages.length} faculty profiles across multiple universities.`,
                    substeps: queryPlan.queries.slice(0, 6).map((q: string) => ({
                        label: q,
                        status: "done",
                    })),
                    data: { pagesFound: crawlResult.pages.length },
                });

                // ─── Step 3: Faculty Extractor Agent ────────────
                sendEvent(controller, "step", {
                    id: "extractor",
                    label: "Extracting faculty information",
                    status: "running",
                    detail: `Processing ${crawlResult.pages.length} pages to extract structured faculty data...`,
                });

                const extractedFaculty = await facultyExtractorAgent(crawlResult.pages);

                sendEvent(controller, "step", {
                    id: "extractor",
                    label: "Extracting faculty information",
                    status: "done",
                    detail: `Extracted detailed profiles for ${extractedFaculty.length} faculty members.`,
                    data: { facultyCount: extractedFaculty.length },
                });

                // ─── Step 4: Relevance Ranker Agent ─────────────
                sendEvent(controller, "step", {
                    id: "ranker",
                    label: "Ranking matches by relevance",
                    status: "running",
                    detail: `Scoring ${extractedFaculty.length} faculty members against your profile...`,
                });

                const rankedFaculty = await relevanceRankerAgent(profileText, extractedFaculty);

                sendEvent(controller, "step", {
                    id: "ranker",
                    label: "Ranking matches by relevance",
                    status: "done",
                    detail: `Ranked all faculty. Top match: ${rankedFaculty[0]?.name || "N/A"} (${Math.round((rankedFaculty[0]?.relevance_score || 0) * 100)}% match).`,
                    data: { topMatch: rankedFaculty[0]?.name },
                });

                // ─── Final Result ───────────────────────────────
                sendEvent(controller, "result", {
                    matches: rankedFaculty,
                });

                sendEvent(controller, "done", {});
            } catch (error) {
                console.error("Pipeline error:", error);
                sendEvent(controller, "error", {
                    message: error instanceof Error ? error.message : "Pipeline failed",
                });
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
