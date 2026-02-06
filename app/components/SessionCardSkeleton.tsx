export default function SessionCardSkeleton() {
  return (
    <div className="rounded-sm border border-[#e6e4e2] bg-white overflow-hidden">
      <div className="px-2 py-1.5 border-b border-[#e6e4e2] flex items-center gap-1.5">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#edebeb]" />
          <div className="w-2 h-2 rounded-full bg-[#edebeb]" />
          <div className="w-2 h-2 rounded-full bg-[#edebeb]" />
        </div>
        <div className="h-3 w-16 bg-[#edebeb] rounded animate-pulse" />
      </div>
      <div className="aspect-video bg-[#edebeb] flex items-center justify-center">
        <svg className="w-6 h-6 animate-spin text-[rgba(125,125,125,1)]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    </div>
  );
}
