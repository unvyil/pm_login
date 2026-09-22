// ─────────────────────────────────────────────────────────────────────────────
// BottomTicker — "Weekly Standup Pulse — 94% teams reported on schedule"
// Shown at the bottom of auth pages, outside the card
// ─────────────────────────────────────────────────────────────────────────────

export function BottomTicker() {
  return (
    <div className="mt-6 flex items-center justify-between px-2">
      {/* Left: pulse icon + text */}
      <div className="flex items-center gap-3">
        {/* Pulse/trending icon */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mango-blue-50">
          <svg
            className="h-4 w-4 text-mango-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Weekly Standup Pulse</p>
          <p className="text-xs text-gray-500">94% teams reported on schedule</p>
        </div>
      </div>

      {/* Right: overlapping avatar circles */}
      <div className="flex -space-x-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-[10px] font-bold text-white">
          T
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-700 text-[10px] font-bold text-white">
          M
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-600 text-[10px] font-bold text-white">
          +5
        </div>
      </div>
    </div>
  );
}
