export default function Footer() {
  return (
    <footer className="border-t border-[rgba(19,19,19,0.08)] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm text-[rgba(125,125,125,1)]">
        <span>Powered by</span>
        <a
          href="https://github.com/browserbase/stagehand"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[#1c1917] hover:text-[#f4ba41] transition-colors cursor-pointer"
        >
          <img src="/stagehand-logo.svg" alt="Stagehand" className="w-5 h-5" />
          Stagehand
        </a>
        <span>on</span>
        <a
          href="https://www.browserbase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[#1c1917] hover:text-[#f03603] transition-colors cursor-pointer"
        >
          <img src="/browserbase-logo.svg" alt="Browserbase" className="w-5 h-5" />
          Browserbase
        </a>
        <span>+</span>
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[#1c1917] hover:opacity-70 transition-opacity cursor-pointer"
        >
          <img src="/nextjs-icon-light-background.png" alt="Next.js" className="w-4 h-4" />
          Next.js
        </a>
      </div>
    </footer>
  );
}
