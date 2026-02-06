export default function Header() {
  return (
    <header className="border-b border-[rgba(19,19,19,0.08)] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/browserbase-icon.svg" alt="Browserbase" className="w-8 h-8 rounded-sm" />
          <h1 className="text-xl font-semibold">AI Research Agent</h1>
        </div>
        <a
          href="https://www.browserbase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-[#969493] hover:text-[#f03603] transition-colors"
        >
          <span>Powered by</span>
          <img src="/browserbase.svg" alt="Browserbase" className="h-5" />
        </a>
      </div>
    </header>
  );
}
