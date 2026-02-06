import { useState } from "react";
import { LiveSession } from "../types";

interface ExpandedBrowserModalProps {
  session: LiveSession | null;
  onClose: () => void;
}

export default function ExpandedBrowserModal({ session, onClose }: ExpandedBrowserModalProps) {
  const [interactionsEnabled, setInteractionsEnabled] = useState(false);

  if (!session) return null;

  const handleClose = () => {
    setInteractionsEnabled(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8 cursor-pointer"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-sm overflow-hidden bb-modal-shadow w-full max-w-5xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-[#e6e4e2] flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#f03603]" />
            <div className="w-3 h-3 rounded-full bg-[#f4ba41]" />
            <div className="w-3 h-3 rounded-full bg-[#90c94d]" />
          </div>
          <span className="text-sm font-medium text-[#4a4848] flex-1">{session.source}</span>
          <button
            onClick={() => setInteractionsEnabled(!interactionsEnabled)}
            className={`px-3 py-1.5 text-xs rounded-sm transition-all duration-200 cursor-pointer focus:outline-none focus:shadow-[0_0_0_2px_#260f17] ${
              interactionsEnabled
                ? "bg-[#f03603] text-white hover:bg-[#d23003]"
                : "bg-[#edebeb] text-[#4a4848] hover:bg-[#e6e4e2]"
            }`}
          >
            {interactionsEnabled ? "Disable Interact" : "Enable Interact"}
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-sm hover:bg-[#edebeb] transition-all duration-200 cursor-pointer focus:outline-none focus:shadow-[0_0_0_2px_#260f17]"
            title="Close"
          >
            <svg className="w-5 h-5 text-[rgba(125,125,125,1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="aspect-video bg-[#edebeb] relative">
          <iframe
            src={`${session.liveViewUrl}&navbar=false`}
            className={`w-full h-full ${!interactionsEnabled ? "pointer-events-none" : ""}`}
            sandbox="allow-same-origin allow-scripts"
            allow="clipboard-read; clipboard-write"
          />
          <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-sm text-white text-xs ${
            interactionsEnabled ? "bg-[#f03603]" : "bg-black/60"
          }`}>
            {interactionsEnabled ? "Interaction On" : "View Only"}
          </div>
        </div>
      </div>
    </div>
  );
}
