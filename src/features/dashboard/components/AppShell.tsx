import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import qwLogo from '@/assets/qw-logo.png';

// ─────────────────────────────────────────────────────────────────────────────
// AppShell — Post-Auth Layout Shell
// ─────────────────────────────────────────────────────────────────────────────
//
// This is the authenticated application chrome: a sticky top navigation bar
// with brand logo, nav links, user avatar + role badge, and a content area
// that renders route-matched children via <Outlet />.
//
// INTEGRATION NOTES (for dashboard / navigation teams):
//   • User data (fullName, role, team, avatarUrl) is read from AuthContext.
//     When Clerk is integrated, this will automatically reflect the real
//     session user — no changes needed here.
//   • Nav links ("Reports", "Teams") currently point to "/" as placeholders.
//     Replace the `to` props with your real routes when they're ready.
//   • The "Admin" link is conditionally rendered for role === 'admin'.
//     Add additional role-gated links using the same pattern.
//   • Avatar falls back to initials when user.avatarUrl is null. Clerk's
//     useUser() provides imageUrl which can be mapped to avatarUrl.
//   • The sign-out handler calls auth.signOut() (currently a mock).
//     Clerk integration: this becomes clerk.signOut() — see useClerkAuth.ts.
//
// ─────────────────────────────────────────────────────────────────────────────

export function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    // TODO [Clerk]: Replace with clerk.signOut() — see useClerkAuth.ts
    signOut();
    navigate('/sign-in');
  };

  // Generate initials for avatar fallback (e.g. "Alex Rivera" → "AR")
  const initials = user?.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Navigation ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo / Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              {/* Brand logo — Vite static import with content-hash cache-busting */}
              <img
                src={qwLogo}
                alt="QuickWorks — Project Mango"
                className="h-8 w-auto max-w-[140px] object-contain"
              />
            </Link>

            {/* Nav links — update `to` props when real routes are available */}
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                to="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
              >
                Reports
              </Link>
              <Link
                to="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
              >
                Teams
              </Link>
              {/* Admin-only nav link — gated by user role */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* Right: User details + avatar + role badge */}
          <div className="flex items-center gap-3">
            {/* Notification bell (placeholder) */}
            <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200" />

            {/* ── User identity block ──────────────────────────────────────
             *  Displays the authenticated user's avatar (or initials
             *  fallback), full name, team, and role badge. All values
             *  are dynamically read from user session state.
             * ─────────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-3">
              {/* Avatar — uses avatarUrl when available, initials otherwise */}
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mango-blue-100 text-sm font-semibold text-mango-blue-700">
                  {initials}
                </div>
              )}

              {/* Name + role badge */}
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">{user?.team}</span>
                  {/* Role badge — dynamically styled: amber for admin, blue for member */}
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      user?.role === 'admin'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-mango-blue-100 text-mango-blue-700'
                    }`}
                  >
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Sign out button */}
              <button
                onClick={handleSignOut}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Sign out"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────────────
       *  All protected route children render here via <Outlet />.
       *  The dashboard team should build their views as route-matched
       *  components — see App.tsx for route definitions.
       * ─────────────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
