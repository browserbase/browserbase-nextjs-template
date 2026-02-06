import { StatusUpdate } from "../types";

interface StatusBannerProps {
  status: StatusUpdate;
}

export default function StatusBanner({ status }: StatusBannerProps) {
  return (
    <div className={`mb-6 px-4 py-3 rounded-sm flex items-center gap-3 ${
      status.phase === "complete" ? "bg-[#90c94d]/20 border border-[#90c94d]/30" :
      status.phase === "error" ? "bg-[#f03603]/10 border border-[#f03603]/30" :
      "bg-[#4da9e4]/10 border border-[#4da9e4]/30"
    }`}>
      {status.phase !== "complete" && status.phase !== "error" && (
        <div className="w-2 h-2 rounded-full bg-[#4da9e4] animate-pulse" />
      )}
      {status.phase === "complete" && (
        <svg className="w-5 h-5 text-[#90c94d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      <span className="text-sm">{status.message}</span>
      {status.source && (
        <span className="text-xs px-2 py-0.5 rounded bg-[#edebeb] text-[rgba(125,125,125,1)]">
          {status.source}
        </span>
      )}
    </div>
  );
}
