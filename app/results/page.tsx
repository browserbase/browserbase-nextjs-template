/**
 * Results Page
 *
 * Displays live browser sessions and research findings.
 * Reads state from ResearchContext.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResearch } from "../context/ResearchContext";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ErrorBanner from "../components/ErrorBanner";
import LiveSessionsGrid from "../components/LiveSessionsGrid";
import StatusBanner from "../components/StatusBanner";
import ResearchResults from "../components/ResearchResults";
import ExpandedBrowserModal from "../components/ExpandedBrowserModal";
import Footer from "../components/Footer";
import { LiveSession } from "../types";

export default function Results() {
  const router = useRouter();
  const {
    query,
    setQuery,
    isResearching,
    liveSessions,
    status,
    findings,
    summary,
    error,
    sessionTime,
    startResearch,
  } = useResearch();

  const [expandedSession, setExpandedSession] = useState<LiveSession | null>(null);
  const [activeResultsTab, setActiveResultsTab] = useState<"sources" | "summary">("sources");

  // Redirect to home if no query
  useEffect(() => {
    if (!query && !isResearching && findings.length === 0) {
      router.push("/");
    }
  }, [query, isResearching, findings.length, router]);

  // Switch to summary tab when research completes
  useEffect(() => {
    if (summary) {
      setActiveResultsTab("summary");
    }
  }, [summary]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSearch = () => {
    startResearch();
  };

  return (
    <div className="min-h-screen bg-[#f9f6f4] bb-grid-pattern text-[rgba(16,13,13,1)] font-sans flex flex-col relative overflow-hidden">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-6 flex-1 pt-8 pb-12 relative z-10">
        {/* Search Input */}
        <div className="mb-8">
          <SearchBar
            query={query}
            setQuery={setQuery}
            isResearching={isResearching}
            onSearch={handleSearch}
          />
        </div>

        {error && <ErrorBanner error={error} />}

        {(isResearching || liveSessions.length > 0) && (
          <LiveSessionsGrid
            liveSessions={liveSessions}
            sessionTime={sessionTime}
            formatTime={formatTime}
            onExpandSession={setExpandedSession}
          />
        )}

        {status && <StatusBanner status={status} />}

        <ResearchResults
          activeTab={activeResultsTab}
          setActiveTab={setActiveResultsTab}
          findings={findings}
          summary={summary}
          isResearching={isResearching}
        />
      </main>

      <Footer />

      <ExpandedBrowserModal
        session={expandedSession}
        onClose={() => setExpandedSession(null)}
      />
    </div>
  );
}
