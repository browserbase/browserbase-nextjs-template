import ReactMarkdown from "react-markdown";
import { Finding } from "../types";

interface FindingCardProps {
  finding: Finding;
}

export default function FindingCard({ finding }: FindingCardProps) {
  return (
    <div className="p-4 rounded-sm bg-[#f9f6f4] border border-[#e6e4e2] hover:border-[#100d0d] transition-all duration-200">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-[rgba(16,13,13,1)] text-sm leading-tight">
          {finding.title}
        </h3>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
          finding.relevance === "high" ? "bg-[#90c94d]/20 text-[#90c94d]" :
          finding.relevance === "medium" ? "bg-[#f4ba41]/20 text-[#f4ba41]" :
          "bg-[#edebeb] text-[rgba(125,125,125,1)]"
        }`}>
          {finding.relevance}
        </span>
      </div>
      <p className="text-xs text-[rgba(125,125,125,1)] mb-2">{finding.source}</p>
      <div className="text-sm text-[#4a4848] mb-3 prose prose-sm max-w-none line-clamp-4">
        <ReactMarkdown>{finding.summary}</ReactMarkdown>
      </div>
      <a
        href={finding.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[#f03603] hover:text-[#d23003] flex items-center gap-1 cursor-pointer"
      >
        View source
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
