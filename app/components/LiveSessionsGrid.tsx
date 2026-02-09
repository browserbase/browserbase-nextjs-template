import { LiveSession } from "../types";
import SessionCard from "./SessionCard";
import SessionCardSkeleton from "./SessionCardSkeleton";

// All sources in order
const ALL_SOURCES = ["News", "Hacker News", "YouTube", "Wikipedia", "Search"];

interface LiveSessionsGridProps {
  liveSessions: LiveSession[];
  sessionTime: number;
  formatTime: (seconds: number) => string;
  onExpandSession: (session: LiveSession) => void;
  isSequentialMode?: boolean;
  isResearching?: boolean;
}

export default function LiveSessionsGrid({
  liveSessions,
  sessionTime,
  formatTime,
  onExpandSession,
  isSequentialMode = false,
  isResearching = false,
}: LiveSessionsGridProps) {
  // Create a map of active sessions by source
  const sessionsBySource = new Map(liveSessions.map(s => [s.source, s]));

  // In sequential mode, show all sources with skeletons for pending ones
  // In parallel mode, show active sessions or all skeletons if none yet
  const showAllSources = isSequentialMode && isResearching;

  return (
    <div className="w-full mb-6 slide-up-enter">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#4a4848]">Live Browser Sessions</span>
          <span className="text-xs px-2 py-0.5 rounded-sm bg-[#4da9e4]/20 text-[#4da9e4]">
            {liveSessions.length} active
          </span>
          {isSequentialMode && isResearching && (
            <span className="text-xs px-2 py-0.5 rounded-sm bg-amber-100 text-amber-700">
              sequential
            </span>
          )}
        </div>
        {/* Session Timer */}
        <div className="flex items-center gap-3 px-3 py-1.5 bg-[#edebeb] border border-[#e6e4e2] rounded-sm">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#4a4848]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-sm text-[#4a4848]">
              <span className="font-medium">Session:</span>{" "}
              <span className="min-w-[52px] inline-block">{formatTime(sessionTime)}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-5 gap-3">
        {showAllSources ? (
          // Sequential mode: show all sources, with active session or skeleton
          ALL_SOURCES.map((source) => {
            const session = sessionsBySource.get(source);
            if (session) {
              return (
                <SessionCard
                  key={session.sessionId}
                  session={session}
                  onExpand={onExpandSession}
                />
              );
            }
            return <SessionCardSkeleton key={source} label={source} />;
          })
        ) : liveSessions.length > 0 ? (
          // Parallel mode with active sessions
          liveSessions.map((session) => (
            <SessionCard
              key={session.sessionId}
              session={session}
              onExpand={onExpandSession}
            />
          ))
        ) : (
          // No sessions yet, show loading skeletons
          ALL_SOURCES.map((source) => (
            <SessionCardSkeleton key={source} label={source} />
          ))
        )}
      </div>
    </div>
  );
}
