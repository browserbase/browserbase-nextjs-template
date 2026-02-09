interface SessionCardSkeletonProps {
  label?: string;
}

export default function SessionCardSkeleton({ label }: SessionCardSkeletonProps) {
  return (
    <div className="rounded-sm border border-[#e6e4e2] bg-white overflow-hidden">
      <div className="px-2 py-1.5 border-b border-[#e6e4e2] flex items-center gap-1.5">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#edebeb]" />
          <div className="w-2 h-2 rounded-full bg-[#edebeb]" />
          <div className="w-2 h-2 rounded-full bg-[#edebeb]" />
        </div>
        {label ? (
          <span className="text-xs font-medium text-[#969493]">{label}</span>
        ) : (
          <div className="h-3 w-16 bg-[#edebeb] rounded animate-pulse" />
        )}
      </div>
      <div className="aspect-video bg-[#edebeb] flex items-center justify-center">
        <div className="text-center">
          <svg className="w-6 h-6 mx-auto text-[#969493] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-[#969493] mt-1 block">Waiting...</span>
        </div>
      </div>
    </div>
  );
}
