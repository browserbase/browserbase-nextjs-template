interface SequentialModeBannerProps {
  isVisible: boolean;
}

export default function SequentialModeBanner({ isVisible }: SequentialModeBannerProps) {
  if (!isVisible) return null;

  return (
    <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">
            Running in sequential mode
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Your Browserbase plan only supports 1 concurrent browser. Upgrade to run all 5 browsers in parallel for faster research.
          </p>
          <a
            href="https://www.browserbase.com/settings"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-amber-800 hover:text-amber-900 transition-colors"
          >
            Upgrade your plan
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
