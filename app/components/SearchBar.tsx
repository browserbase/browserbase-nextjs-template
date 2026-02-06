interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  isResearching: boolean;
  onSearch: () => void;
}

export default function SearchBar({ query, setQuery, isResearching, onSearch }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isResearching) {
      onSearch();
    }
  };

  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., 'superbowl 2026'"
        className="flex-1 px-5 py-4 rounded-md bg-white border border-[#e6e4e2] text-[rgba(16,13,13,1)] placeholder-[#969493] text-base shadow-[0_2px_8px_rgba(0,0,0,0.06)] focus:outline-none focus:border-[#f03603] focus:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_0_0_3px_rgba(240,54,3,0.1)] transition-all duration-300"
        disabled={isResearching}
      />
      <button
        onClick={onSearch}
        disabled={isResearching || !query.trim()}
        className="px-8 py-4 rounded-md bg-[#f03603] text-white border border-[#f03603] font-medium shadow-md hover:bg-white hover:text-[#f03603] hover:-translate-y-0.5 hover:shadow-lg disabled:bg-[#edebeb] disabled:text-[rgba(125,125,125,1)] disabled:border-[#edebeb] disabled:shadow-none disabled:hover:translate-y-0 transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:shadow-[0_0_0_3px_rgba(240,54,3,0.1)]"
      >
        {isResearching ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Researching...
          </>
        ) : (
          "Research"
        )}
      </button>
    </div>
  );
}
