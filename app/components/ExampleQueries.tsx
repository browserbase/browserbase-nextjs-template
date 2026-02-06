interface ExampleQueriesProps {
  onSelect: (query: string) => void;
}

const EXAMPLES = [
  "superbowl 2026",
  "new moon mission nasa",
  "gluten-free camping meals",
];

export default function ExampleQueries({ onSelect }: ExampleQueriesProps) {
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <span className="text-sm text-[#969493]">Try:</span>
      {EXAMPLES.map((example) => (
        <button
          key={example}
          onClick={() => onSelect(example)}
          className="px-4 py-2 text-sm rounded-md bg-white border border-[#e6e4e2] text-[#4a4848] hover:border-[#f03603] hover:text-[#f03603] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer focus:outline-none focus:shadow-[0_0_0_3px_rgba(240,54,3,0.1)]"
        >
          {example}
        </button>
      ))}
    </div>
  );
}
