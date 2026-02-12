export default function Header() {
  return (
    <header className="border-b border-[rgba(19,19,19,0.08)] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/browserbase-icon.svg" alt="Browserbase" className="w-8 h-8 rounded-sm" />
          <h1 className="text-xl font-semibold">AI Research Agent</h1>
        </div>
<img src="/Browserbase-Vercel.png" alt="Browserbase + Vercel" className="h-8" />
      </div>
    </header>
  );
}
