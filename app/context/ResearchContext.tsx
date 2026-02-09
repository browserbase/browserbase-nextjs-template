"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";
import { Finding, StatusUpdate, LiveSession, ResearchSummary } from "../types";

interface ResearchContextType {
  query: string;
  setQuery: (query: string) => void;
  isResearching: boolean;
  isSequentialMode: boolean;
  liveSessions: LiveSession[];
  status: StatusUpdate | null;
  findings: Finding[];
  summary: ResearchSummary | null;
  error: string | null;
  sessionTime: number;
  startResearch: (searchQuery?: string) => Promise<void>;
  resetResearch: () => void;
}

const ResearchContext = createContext<ResearchContextType | null>(null);

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [isResearching, setIsResearching] = useState(false);
  const [isSequentialMode, setIsSequentialMode] = useState(false);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [status, setStatus] = useState<StatusUpdate | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [summary, setSummary] = useState<ResearchSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const resetResearch = () => {
    setLiveSessions([]);
    setStatus(null);
    setFindings([]);
    setSummary(null);
    setError(null);
    setSessionTime(0);
    setIsSequentialMode(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startResearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    if (searchQuery) setQuery(searchQuery);

    // Reset state
    setIsResearching(true);
    setLiveSessions([]);
    setStatus({ message: "Initializing browser sessions...", phase: "init" });
    setFindings([]);
    setSummary(null);
    setError(null);
    setSessionTime(0);

    // Start timer
    timerRef.current = window.setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let eventType = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7);
          } else if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            switch (eventType) {
              case "mode":
                setIsSequentialMode(data.isSequential);
                break;
              case "liveViews":
                setLiveSessions(data.sessions);
                break;
              case "status":
                setStatus(data);
                break;
              case "findings":
                setFindings(data.findings);
                break;
              case "complete":
                setFindings(data.findings);
                setSummary(data.summary);
                setStatus({ message: "Research complete!", phase: "complete" });
                setIsResearching(false);
                if (timerRef.current) clearInterval(timerRef.current);
                break;
              case "error":
                setError(data.message);
                setIsResearching(false);
                if (timerRef.current) clearInterval(timerRef.current);
                break;
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
        setIsResearching(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  };

  return (
    <ResearchContext.Provider
      value={{
        query,
        setQuery,
        isResearching,
        isSequentialMode,
        liveSessions,
        status,
        findings,
        summary,
        error,
        sessionTime,
        startResearch,
        resetResearch,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error("useResearch must be used within a ResearchProvider");
  }
  return context;
}
