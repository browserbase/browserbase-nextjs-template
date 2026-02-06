export interface Finding {
  title: string;
  source: string;
  url: string;
  summary: string;
  relevance: "high" | "medium" | "low";
}

export interface ResearchSummary {
  overview: string;
  keyFacts: string[];
  recentDevelopments: string | null;
  sourcesSummary: string;
}

export interface StatusUpdate {
  message: string;
  phase: string;
  source?: string;
}

export interface LiveSession {
  source: string;
  liveViewUrl: string;
  sessionId: string;
}
