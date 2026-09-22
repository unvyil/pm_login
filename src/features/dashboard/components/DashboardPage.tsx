import { useAuth } from '@/features/auth/context/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// DashboardPage — Lightweight Post-Auth Placeholder Stub
// ─────────────────────────────────────────────────────────────────────────────
//
// PURPOSE:
//   This is a **temporary landing view** that verifies the auth flow works
//   end-to-end. It is NOT the production home dashboard — that will be built
//   by the dashboard team in a future sprint.
//
// WHAT THIS STUB DOES:
//   1. Reads the authenticated user from AuthContext (name, team, role).
//   2. Displays a welcome card with pulse metrics pulled from session state.
//   3. Provides a dev-only role switcher to test RBAC without re-logging-in.
//
// INTEGRATION NOTES (for dashboard team):
//   • Replace this entire component with your production <DashboardPage />.
//   • User data is available via useAuth() → { user, isAuthenticated }.
//   • The AppShell layout (top nav, avatar, role badge) stays — only swap
//     the <Outlet /> content rendered inside it.
//   • The mock data (94% pulse, Sprint 1, etc.) should be replaced with
//     real API calls to your /api/pulse and /api/sprints endpoints.
//   • See `src/features/auth/context/AuthContext.tsx` for the User type and
//     available auth actions.
//
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user, mockSignIn } = useAuth();

  return (
    <div className="space-y-6">
      {/* ── Welcome Card ─────────────────────────────────────────────────
       *  Dynamically reads user.fullName, user.role, and user.team from
       *  the auth session state. The pulse score (94%) is a static
       *  placeholder — wire this to your /api/pulse endpoint.
       * ─────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.fullName}! 👋
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Here's your weekly standup pulse overview.
            </p>
          </div>
          {/* Role badge — dynamically styled based on user.role */}
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              user?.role === 'admin'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-mango-blue-100 text-mango-blue-700'
            }`}
          >
            {user?.role}
          </span>
        </div>

        {/* Quick stats — replace static values with API data */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-mango-blue-50 p-4">
            <p className="text-sm font-medium text-mango-blue-600">Team</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{user?.team}</p>
          </div>
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm font-medium text-green-600">Pulse Score</p>
            {/* TODO: Replace with real pulse data from /api/pulse */}
            <p className="mt-1 text-lg font-bold text-gray-900">94%</p>
          </div>
          <div className="rounded-xl bg-purple-50 p-4">
            <p className="text-sm font-medium text-purple-600">Sprint</p>
            {/* TODO: Replace with real sprint data from /api/sprints/current */}
            <p className="mt-1 font-mono text-lg font-bold text-gray-900">Sprint 1 · Active</p>
          </div>
        </div>
      </div>

      {/* ── DEV-ONLY: Role Switcher ──────────────────────────────────────
       *  This panel lets developers instantly switch between the two
       *  seeded mock users (admin / member) to test RBAC behaviour
       *  without signing out and back in.
       *
       *  REMOVE THIS BLOCK before shipping to production, or gate it
       *  behind import.meta.env.DEV so it's tree-shaken from prod builds.
       * ─────────────────────────────────────────────────────────────── */}
      {import.meta.env.DEV && (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-500">
            🛠️ Dev-Only — Role Switcher
          </h3>
          <p className="mb-4 text-xs text-gray-400">
            Switch between seeded mock users to test RBAC. This panel is
            automatically stripped from production builds.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => mockSignIn('admin')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                user?.role === 'admin'
                  ? 'bg-amber-500 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Alex Rivera — Admin
            </button>
            <button
              onClick={() => mockSignIn('member')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                user?.role === 'member'
                  ? 'bg-mango-blue-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Jamie Chen — Member
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
