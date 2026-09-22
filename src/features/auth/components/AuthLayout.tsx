import type { ReactNode } from "react";
import { BottomTicker } from "./BottomTicker";
import qwLogo from "@/assets/qw-logo.png";

// ─────────────────────────────────────────────────────────────────────────────
// AuthLayout — Shared wrapper for Sign In / Sign Up pages
// Centers the auth card on a light blue background with bottom ticker
// ─────────────────────────────────────────────────────────────────────────────

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card container */}
        <div className="rounded-2xl bg-white px-8 pb-8 pt-6 shadow-xl shadow-blue-100/50">
          {/* Sprint status badge */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-[#EFF4FF] px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-mango-blue-600" />
              <span className="font-mono text-xs font-semibold tracking-wider text-gray-600">
                SPRINT 1 &bull; ACTIVE
              </span>
            </div>
            {/* Lock icon */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          {/*
           * Brand logo — imported as a Vite static asset.
           * Vite appends a content-hash to the filename at build time
           * (e.g. qw-logo-Ab3xZ.png), which guarantees cache-busting
           * whenever the file changes. No manual query params needed.
           *
           * To swap the logo: replace src/assets/qw-logo.png and rebuild.
           */}
          <div className="mb-5 flex justify-center">
            <img
              src={qwLogo}
              alt="QuickWorks — Project Mango"
              className="max-h-14 w-auto max-w-[220px] object-contain"
            />
          </div>

          {children}
        </div>

        {/* Bottom ticker — outside the card */}
        <BottomTicker />
      </div>
    </div>
  );
}
