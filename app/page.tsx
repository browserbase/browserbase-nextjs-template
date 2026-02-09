/**
 * Home Page
 *
 * Landing page with search interface. Redirects to /results on search.
 *
 * @see https://docs.browserbase.com
 */

"use client";

import { useRouter } from "next/navigation";
import { useResearch } from "./context/ResearchContext";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ExampleQueries from "./components/ExampleQueries";
import Footer from "./components/Footer";

export default function Home() {
  const router = useRouter();
  const { query, setQuery, isResearching, startResearch, resetResearch } = useResearch();

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    // Set query first so results page doesn't redirect back
    if (searchQuery) setQuery(searchQuery);

    resetResearch();
    router.push("/results");

    // Small delay to ensure navigation happens first
    setTimeout(() => {
      startResearch(searchQuery);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#f9f6f4] bb-grid-pattern text-[rgba(16,13,13,1)] font-sans flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#f03603]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-[#4da9e4]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#90c94d]/5 rounded-full blur-3xl"></div>
      </div>

      <Header />

      <main className="w-full max-w-7xl mx-auto px-6 flex-1 pt-[20vh] pb-12 relative z-10">
        {/* Search Input */}
        <div className="mb-0">
          {/* Headline */}
          <div className="text-center mb-8">
            <h2 className="hero-title text-4xl font-bold text-[rgba(16,13,13,1)] mb-3 tracking-tight">
              Research anything in{" "}
              <span className="text-[#f03603]">seconds</span>
            </h2>
            <p className="hero-subtitle text-lg text-[#4a4848] mb-6 max-w-xl mx-auto">
              Watch AI agents browse the web in real-time, gathering insights from multiple sources simultaneously.
            </p>
            <div className="hero-badges flex items-center justify-center gap-2 flex-wrap">
              <span className="source-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e6e4e2] text-xs font-medium text-[#4a4848] cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#4da9e4]"></span>
                Google
              </span>
              <span className="source-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e6e4e2] text-xs font-medium text-[#4a4848] cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#90c94d]"></span>
                Wikipedia
              </span>
              <span className="source-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e6e4e2] text-xs font-medium text-[#4a4848] cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#f03603]"></span>
                YouTube
              </span>
              <span className="source-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e6e4e2] text-xs font-medium text-[#4a4848] cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#f4ba41]"></span>
                Hacker News
              </span>
              <span className="source-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e6e4e2] text-xs font-medium text-[#4a4848] cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#969493]"></span>
                + more
              </span>
            </div>
          </div>
          <div className="hero-search">
            <SearchBar
              query={query}
              setQuery={setQuery}
              isResearching={isResearching}
              onSearch={() => handleSearch()}
            />
            <ExampleQueries onSelect={(example) => handleSearch(example)} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
