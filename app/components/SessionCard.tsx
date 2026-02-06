import { LiveSession } from "../types";

interface SessionCardProps {
  session: LiveSession;
  onExpand: (session: LiveSession) => void;
}

export default function SessionCard({ session, onExpand }: SessionCardProps) {
  return (
    <div className="rounded-sm border border-[#e6e4e2] bg-white overflow-hidden bb-shadow">
      <div className="px-2 py-1.5 border-b border-[#e6e4e2] flex items-center gap-1.5">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#f03603]" />
          <div className="w-2 h-2 rounded-full bg-[#f4ba41]" />
          <div className="w-2 h-2 rounded-full bg-[#90c94d]" />
        </div>
        <span className="text-xs text-[rgba(125,125,125,1)] truncate flex-1">{session.source}</span>
        <button
          onClick={() => onExpand(session)}
          className="p-1 rounded-sm hover:bg-[#edebeb] transition-all duration-200 cursor-pointer focus:outline-none focus:shadow-[0_0_0_2px_#260f17]"
          title="Expand view"
        >
          <svg className="w-3.5 h-3.5 text-[rgba(125,125,125,1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
      <div className="aspect-video bg-[#edebeb]">
        <iframe
          src={`${session.liveViewUrl}&navbar=false`}
          className="w-full h-full"
          sandbox="allow-same-origin allow-scripts"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}
