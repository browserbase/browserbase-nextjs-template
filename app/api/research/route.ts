/**
 * Research API Route
 *
 * Handles parallel browser research using Stagehand + Browserbase.
 * Streams findings back to the client via Server-Sent Events (SSE).
 *
 * @see https://docs.stagehand.dev
 * @see https://docs.browserbase.com
 */

import { Stagehand, AISdkClient } from "@browserbasehq/stagehand";
import { z } from "zod";
import { createGateway, generateObject } from "ai";

/** Maximum execution time for this API route (in seconds) */
export const maxDuration = 300;

/** Schema for validating research findings */
const ResearchFindingSchema = z.object({
  title: z.string().describe("Title or headline of the finding"),
  source: z.string().describe("Source website or publication"),
  url: z.string().describe("URL of the source"),
  summary: z.string().describe("Key information extracted"),
  relevance: z.enum(["high", "medium", "low"]).describe("How relevant this is to the query"),
});

type Finding = z.infer<typeof ResearchFindingSchema>;

/** Schema for AI-generated research summary */
const ResearchSummarySchema = z.object({
  overview: z.string().describe("2-3 sentence direct answer to the query with brief context"),
  keyFacts: z.array(z.string()).min(3).max(6).describe("Specific facts with dates, numbers, or names"),
  recentDevelopments: z.string().nullable().describe("Latest news or updates if applicable, null if none"),
  sourcesSummary: z.string().describe("Brief note on the types of sources consulted"),
});

/** Represents an active Stagehand session */
interface StagehandSession {
  stagehand: Stagehand;
  sessionId: string;
  liveViewUrl: string;
  source: string;
}

/** Gateway provider for AI calls via Vercel AI Gateway */
const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

/**
 * Fetches the live view URL for a Browserbase session
 * @param sessionId - The Browserbase session ID
 * @returns The debugger fullscreen URL for live viewing
 */
async function getLiveViewUrl(sessionId: string): Promise<string> {
  const response = await fetch(
    `https://api.browserbase.com/v1/sessions/${sessionId}/debug`,
    {
      headers: {
        "x-bb-api-key": process.env.BROWSERBASE_API_KEY!,
      },
    }
  );
  const data = await response.json();
  return data.debuggerFullscreenUrl;
}

/**
 * Creates a new Stagehand session with Browserbase
 * @param source - Label for this browser session (e.g., "Google", "Wikipedia")
 * @returns Stagehand session with live view URL
 */
async function createStagehandSession(source: string): Promise<StagehandSession> {
  const llmClient = new AISdkClient({
    model: gateway("anthropic/claude-sonnet-4-20250514"),
  });

  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    llmClient,
  });

  await stagehand.init();

  const sessionId = stagehand.browserbaseSessionID!;
  const liveViewUrl = await getLiveViewUrl(sessionId);

  return {
    stagehand,
    sessionId,
    liveViewUrl,
    source,
  };
}

/**
 * Researches a query using Google Search
 * Navigates to search results and extracts content from top results
 */
async function researchGoogle(
  stagehand: Stagehand,
  query: string,
  onStatus: (msg: string) => void,
  onFinding: (finding: Finding) => void
): Promise<void> {
  try {
    const page = stagehand.context.activePage()!;

    onStatus("Searching the web...");
    // Use DuckDuckGo - more reliable, no CAPTCHAs
    await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`);

    // Wait for results to load
    await page.waitForTimeout(2000);

    // Extract search results using Stagehand
    const searchResults = await stagehand.extract(
      "Extract the top 5 organic search result links with their titles and URLs. Skip any ads or sponsored results.",
      z.object({
        results: z.array(z.object({
          title: z.string().describe("The title/headline of the search result"),
          url: z.string().describe("The URL of the search result"),
        })).max(5),
      })
    );

    console.log(`DuckDuckGo found ${searchResults.results.length} results`);

    // Visit top results and extract content
    for (let i = 0; i < Math.min(3, searchResults.results.length); i++) {
      const result = searchResults.results[i];
      if (!result.url || result.url.includes("duckduckgo.com")) continue;

      onStatus(`Reading: ${result.title.slice(0, 30)}...`);

      try {
        await page.goto(result.url, { waitUntil: "domcontentloaded", timeoutMs: 15000 });

        const content = await stagehand.extract(
          `Extract the key information about "${query}" from this article. Focus on specific facts, dates, numbers, names, locations, and important details.`,
          z.object({
            summary: z.string().describe("Comprehensive summary of the relevant content (2-4 paragraphs)"),
            keyFacts: z.array(z.string()).describe("List of specific facts, dates, numbers mentioned"),
          })
        );

        if (content.summary) {
          const summaryText = content.keyFacts.length > 0
            ? `${content.summary}\n\n**Key facts:**\n${content.keyFacts.map(f => `- ${f}`).join("\n")}`
            : content.summary;

          onFinding({
            title: result.title,
            source: new URL(result.url).hostname.replace("www.", ""),
            url: result.url,
            summary: summaryText,
            relevance: "high",
          });
        }
      } catch (err) {
        console.error(`Failed to visit ${result.url}:`, err instanceof Error ? err.message : err);
      }
    }
  } catch (error) {
    console.error("Search failed:", error instanceof Error ? error.message : error);
  }
}

/**
 * Researches a query using Wikipedia
 * Attempts to find and extract content from a relevant Wikipedia article
 */
async function researchWikipedia(
  stagehand: Stagehand,
  query: string,
  onStatus: (msg: string) => void,
  onFinding: (finding: Finding) => void
): Promise<void> {
  try {
    const page = stagehand.context.activePage()!;

    onStatus("Checking Wikipedia...");
    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/ /g, "_"))}`;
    await page.goto(wikiUrl);

    // Check if it's an actual article
    const pageCheck = await stagehand.extract(
      "Is this a valid Wikipedia article page (not a disambiguation, search results, or error page)?",
      z.object({
        isValidArticle: z.boolean().describe("True if this is a valid Wikipedia article with content"),
        articleTitle: z.string().optional().describe("The title of the article if valid"),
      })
    );

    if (pageCheck.isValidArticle) {
      onStatus("Reading article...");

      const content = await stagehand.extract(
        `Extract the most important facts about "${query}" from this Wikipedia article. Include key dates, locations, people, statistics, and notable information.`,
        z.object({
          summary: z.string().describe("Comprehensive summary of the Wikipedia article (2-4 paragraphs)"),
          keyFacts: z.array(z.string()).describe("Important dates, statistics, names, and facts"),
        })
      );

      if (content.summary) {
        const summaryText = content.keyFacts.length > 0
          ? `${content.summary}\n\n**Key facts:**\n${content.keyFacts.map(f => `- ${f}`).join("\n")}`
          : content.summary;

        onFinding({
          title: pageCheck.articleTitle || `Wikipedia: ${query}`,
          source: "Wikipedia",
          url: page.url(),
          summary: summaryText,
          relevance: "high",
        });
      }
    }
  } catch (error) {
    console.error("Wikipedia research failed:", error instanceof Error ? error.message : error);
  }
}

/**
 * Researches a query using Hacker News (via Algolia search)
 * Extracts relevant discussions and comments
 */
async function researchHackerNews(
  stagehand: Stagehand,
  query: string,
  onStatus: (msg: string) => void,
  onFinding: (finding: Finding) => void
): Promise<void> {
  try {
    const page = stagehand.context.activePage()!;

    onStatus("Searching HN...");
    await page.goto(`https://hn.algolia.com/?q=${encodeURIComponent(query)}`);

    const content = await stagehand.extract(
      `Extract the top 3 most relevant Hacker News discussions about "${query}". Include titles, points, comment counts, and any visible summary.`,
      z.object({
        discussions: z.array(z.object({
          title: z.string().describe("Title of the HN post"),
          points: z.string().optional().describe("Number of points/upvotes"),
          comments: z.string().optional().describe("Number of comments"),
          summary: z.string().optional().describe("Brief description if available"),
        })).max(3),
      })
    );

    if (content.discussions.length > 0) {
      const summaryText = content.discussions.map(d => {
        let text = `**${d.title}**`;
        if (d.points || d.comments) {
          text += ` (${d.points || "?"} points, ${d.comments || "?"} comments)`;
        }
        if (d.summary) {
          text += `\n${d.summary}`;
        }
        return text;
      }).join("\n\n");

      onFinding({
        title: `Hacker News discussions on ${query}`,
        source: "Hacker News",
        url: `https://hn.algolia.com/?q=${encodeURIComponent(query)}`,
        summary: summaryText,
        relevance: "medium",
      });
    }
  } catch (error) {
    console.error("Hacker News research failed:", error instanceof Error ? error.message : error);
  }
}

/**
 * Researches a query using YouTube search
 * Extracts relevant video information from search results
 */
async function researchYouTube(
  stagehand: Stagehand,
  query: string,
  onStatus: (msg: string) => void,
  onFinding: (finding: Finding) => void
): Promise<void> {
  try {
    const page = stagehand.context.activePage()!;

    onStatus("Searching YouTube...");

    // Navigate without waiting for full load - YouTube is often slow
    await page.goto(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);

    // Give YouTube time to render search results
    await page.waitForTimeout(5000);

    onStatus("Extracting YouTube results...");

    const content = await stagehand.extract(
      `Extract the top 3 most relevant YouTube videos about "${query}". Focus on informative content, not shorts or ads.`,
      z.object({
        videos: z.array(z.object({
          title: z.string().describe("Title of the video"),
          channel: z.string().optional().describe("Channel name"),
          views: z.string().optional().describe("View count"),
          duration: z.string().optional().describe("Video duration"),
          description: z.string().optional().describe("Video description snippet"),
        })).max(3),
      })
    );

    if (content.videos.length > 0) {
      const summaryText = content.videos.map(v => {
        let text = `**${v.title}**`;
        if (v.channel) text += ` by ${v.channel}`;
        if (v.views) text += ` • ${v.views}`;
        if (v.duration) text += ` • ${v.duration}`;
        if (v.description) text += `\n${v.description}`;
        return text;
      }).join("\n\n");

      onFinding({
        title: `YouTube videos on ${query}`,
        source: "YouTube",
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        summary: summaryText,
        relevance: "medium",
      });
    }
  } catch (error) {
    console.error("YouTube research failed:", error instanceof Error ? error.message : error);
    // YouTube search failed, continue with other sources
  }
}

/**
 * Researches a query using Google News
 * Extracts recent news articles and headlines
 */
async function researchGoogleNews(
  stagehand: Stagehand,
  query: string,
  onStatus: (msg: string) => void,
  onFinding: (finding: Finding) => void
): Promise<void> {
  try {
    const page = stagehand.context.activePage()!;

    onStatus("Searching news...");
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=nws`);

    const content = await stagehand.extract(
      `Extract the top 3 most relevant recent news articles about "${query}". Focus on the most recent and authoritative sources.`,
      z.object({
        articles: z.array(z.object({
          headline: z.string().describe("Article headline"),
          source: z.string().optional().describe("News source/publication"),
          date: z.string().optional().describe("Publication date"),
          snippet: z.string().optional().describe("Article preview/snippet"),
        })).max(3),
      })
    );

    if (content.articles.length > 0) {
      const summaryText = content.articles.map(a => {
        let text = `**${a.headline}**`;
        if (a.source || a.date) {
          text += ` — ${[a.source, a.date].filter(Boolean).join(", ")}`;
        }
        if (a.snippet) text += `\n${a.snippet}`;
        return text;
      }).join("\n\n");

      onFinding({
        title: `Recent news on ${query}`,
        source: "Google News",
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=nws`,
        summary: summaryText,
        relevance: "high",
      });
    }
  } catch (error) {
    console.error("Google News research failed:", error instanceof Error ? error.message : error);
  }
}

/**
 * POST /api/research
 *
 * Performs parallel web research using 5 Stagehand browser sessions.
 * Streams results back to the client via Server-Sent Events.
 *
 * @param req - Request with JSON body containing `query` string
 * @returns SSE stream with events: status, liveViews, findings, complete, error
 */
export async function POST(req: Request) {
  const { query } = await req.json();

  if (!query || typeof query !== "string") {
    return Response.json({ error: "Query is required" }, { status: 400 });
  }

  const apiKey = process.env.BROWSERBASE_API_KEY;
  const projectId = process.env.BROWSERBASE_PROJECT_ID;

  if (!apiKey || !projectId) {
    return Response.json(
      { error: "Browserbase credentials not configured" },
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  let writerClosed = false;

  const sendEvent = async (event: string, data: unknown) => {
    if (writerClosed) return;
    try {
      await writer.write(
        encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
      );
    } catch {
      writerClosed = true;
    }
  };

  const closeWriter = async () => {
    if (writerClosed) return;
    try {
      writerClosed = true;
      await writer.close();
    } catch {
      // Already closed
    }
  };

  (async () => {
    const sessions: StagehandSession[] = [];
    const sources = ["Search", "Wikipedia", "Hacker News", "YouTube", "News"];

    try {
      await sendEvent("status", { message: "Starting 5 browser sessions...", phase: "init" });

      // Create all 5 Stagehand sessions in parallel
      const sessionPromises = sources.map(source => createStagehandSession(source));
      const createdSessions = await Promise.all(sessionPromises);
      sessions.push(...createdSessions);

      // Send all live view URLs to frontend
      await sendEvent("liveViews", {
        sessions: sessions.map(s => ({
          source: s.source,
          liveViewUrl: s.liveViewUrl,
          sessionId: s.sessionId,
        })),
      });

      await sendEvent("status", { message: "Researching in parallel...", phase: "researching" });

      const allFindings: Finding[] = [];

      const onFinding = (finding: Finding) => {
        allFindings.push(finding);
        sendEvent("findings", { findings: allFindings });
      };

      // Run all research in parallel using Stagehand instances
      await Promise.allSettled([
        researchGoogle(sessions[0].stagehand, query,
          (msg) => sendEvent("status", { message: msg, phase: "researching", source: "Search" }),
          onFinding),
        researchWikipedia(sessions[1].stagehand, query,
          (msg) => sendEvent("status", { message: msg, phase: "researching", source: "Wikipedia" }),
          onFinding),
        researchHackerNews(sessions[2].stagehand, query,
          (msg) => sendEvent("status", { message: msg, phase: "researching", source: "Hacker News" }),
          onFinding),
        researchYouTube(sessions[3].stagehand, query,
          (msg) => sendEvent("status", { message: msg, phase: "researching", source: "YouTube" }),
          onFinding),
        researchGoogleNews(sessions[4].stagehand, query,
          (msg) => sendEvent("status", { message: msg, phase: "researching", source: "News" }),
          onFinding),
      ]);

      // Generate AI synthesis
      await sendEvent("status", {
        message: "Synthesizing findings...",
        phase: "summarizing",
      });

      let finalSummary: z.infer<typeof ResearchSummarySchema> | null = null;
      if (allFindings.length > 0) {
        const findingsText = allFindings
          .map((f) => `Source: ${f.source}\n${f.summary}`)
          .join("\n\n---\n\n");

        const { object } = await generateObject({
          model: gateway("anthropic/claude-sonnet-4-20250514"),
          schema: ResearchSummarySchema,
          prompt: `Based on these research findings about "${query}", create a structured summary.

Guidelines:
- overview: Provide a direct answer to the query in 2-3 sentences with essential context
- keyFacts: List 4-6 specific facts including dates, numbers, names, or statistics
- recentDevelopments: Include recent news/updates if relevant, otherwise set to null
- sourcesSummary: Briefly note what types of sources were consulted

Be factual and specific. Include actual numbers, dates, and names from the research.

Research findings:
${findingsText}`,
        });

        finalSummary = object;
      } else {
        finalSummary = {
          overview: `Limited information found for "${query}". Try a more specific query.`,
          keyFacts: [],
          recentDevelopments: null,
          sourcesSummary: "No sources were successfully retrieved.",
        };
      }

      await sendEvent("complete", {
        findings: allFindings,
        summary: finalSummary,
      });
    } catch (error) {
      await sendEvent("error", {
        message: error instanceof Error ? error.message : "Research failed",
      });
    } finally {
      // Close all Stagehand sessions
      for (const session of sessions) {
        try {
          await session.stagehand.close();
        } catch {
          // Session already closed
        }
      }
      await closeWriter();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
