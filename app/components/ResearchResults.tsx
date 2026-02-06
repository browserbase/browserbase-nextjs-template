import { Finding, ResearchSummary } from "../types";
import FindingCard from "./FindingCard";

interface ResearchResultsProps {
  activeTab: "sources" | "summary";
  setActiveTab: (tab: "sources" | "summary") => void;
  findings: Finding[];
  summary: ResearchSummary | null;
  isResearching: boolean;
}

export default function ResearchResults({
  activeTab,
  setActiveTab,
  findings,
  summary,
  isResearching,
}: ResearchResultsProps) {
  return (
    <div className="rounded-sm border border-[#e6e4e2] bg-white overflow-hidden bb-shadow slide-up-enter slide-up-delay-1">
      <div className="px-4 py-3 border-b border-[#e6e4e2] flex items-center gap-4">
        <button
          onClick={() => setActiveTab("summary")}
          className={`text-sm font-medium transition-all duration-200 cursor-pointer pb-1 border-b-2 ${
            activeTab === "summary"
              ? "text-[#f03603] border-[#f03603]"
              : "text-[#4a4848] border-transparent hover:text-[rgba(16,13,13,1)]"
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab("sources")}
          className={`text-sm font-medium transition-all duration-200 cursor-pointer pb-1 border-b-2 flex items-center gap-2 ${
            activeTab === "sources"
              ? "text-[#f03603] border-[#f03603]"
              : "text-[#4a4848] border-transparent hover:text-[rgba(16,13,13,1)]"
          }`}
        >
          Sources
          {findings.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-sm bg-[#edebeb] text-[rgba(125,125,125,1)]">
              {findings.length}
            </span>
          )}
        </button>
      </div>
      <div className="p-4 h-[500px] overflow-y-auto">
        {activeTab === "summary" ? (
          summary ? (
            <div className="space-y-6">
              {/* Overview Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-[#f03603] rounded-full" />
                  <h2 className="text-sm font-semibold text-[rgba(16,13,13,1)] uppercase tracking-wide">
                    Overview
                  </h2>
                </div>
                <p className="text-sm text-[#4a4848] leading-relaxed pl-3">
                  {summary.overview}
                </p>
              </section>

              {/* Key Facts Section */}
              {summary.keyFacts.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-[#4da9e4] rounded-full" />
                    <h2 className="text-sm font-semibold text-[rgba(16,13,13,1)] uppercase tracking-wide">
                      Key Facts
                    </h2>
                  </div>
                  <ul className="space-y-2 pl-3">
                    {summary.keyFacts.map((fact, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#4a4848]">
                        <span className="w-1.5 h-1.5 bg-[#4da9e4] rounded-full mt-1.5 shrink-0" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Recent Developments Section */}
              {summary.recentDevelopments && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-[#90c94d] rounded-full" />
                    <h2 className="text-sm font-semibold text-[rgba(16,13,13,1)] uppercase tracking-wide">
                      Recent Developments
                    </h2>
                  </div>
                  <p className="text-sm text-[#4a4848] leading-relaxed pl-3">
                    {summary.recentDevelopments}
                  </p>
                </section>
              )}

              {/* Sources Summary Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-[#969493] rounded-full" />
                  <h2 className="text-sm font-semibold text-[rgba(16,13,13,1)] uppercase tracking-wide">
                    Sources
                  </h2>
                </div>
                <p className="text-sm text-[#4a4848] leading-relaxed pl-3">
                  {summary.sourcesSummary}
                </p>
              </section>
            </div>
          ) : isResearching ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-[#edebeb] rounded w-full" />
              <div className="h-4 bg-[#edebeb] rounded w-5/6" />
              <div className="h-4 bg-[#edebeb] rounded w-4/6" />
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-[rgba(125,125,125,1)] text-sm">
              Summary will appear here after research completes
            </div>
          )
        ) : (
          findings.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {findings.map((finding, index) => (
                <FindingCard key={index} finding={finding} />
              ))}
            </div>
          ) : !isResearching ? (
            <div className="h-32 flex items-center justify-center text-[rgba(125,125,125,1)] text-sm">
              Research findings will appear here
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-sm bg-[#f9f6f4] animate-pulse">
                  <div className="h-4 bg-[#edebeb] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#edebeb] rounded w-1/4 mb-3" />
                  <div className="h-3 bg-[#edebeb] rounded w-full mb-1" />
                  <div className="h-3 bg-[#edebeb] rounded w-5/6" />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
