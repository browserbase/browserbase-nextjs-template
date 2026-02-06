interface ErrorBannerProps {
  error: string;
}

export default function ErrorBanner({ error }: ErrorBannerProps) {
  return (
    <div className="mb-6 px-4 py-3 rounded-sm bg-[#f03603]/10 border border-[#f03603]/30 text-[#d23003]">
      <strong>Error:</strong> {error}
    </div>
  );
}
