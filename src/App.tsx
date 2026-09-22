import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { SignInPage } from '@/features/auth/components/SignInPage';
import { SignUpPage } from '@/features/auth/components/SignUpPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppShell } from '@/features/dashboard/components/AppShell';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';

// ─────────────────────────────────────────────────────────────────────────────
// App — Root Routing Configuration
// ─────────────────────────────────────────────────────────────────────────────
//
// ROUTE MAP:
//   /sign-in   → Public  | Sign In page (redirects away if already authenticated)
//   /sign-up   → Public  | Sign Up page (redirects away if already authenticated)
//   /          → Auth    | Dashboard stub (any authenticated user)
//   /admin     → Auth    | Admin panel (role: 'admin' only)
//   *          → Fallback → redirects to /
//
// ADDING NEW ROUTES:
//   • Public routes: wrap with <PublicOnlyRoute> to redirect authed users.
//   • Protected routes: nest inside the <ProtectedRoute><AppShell /></ProtectedRoute>
//     layout route. Add role constraints via <ProtectedRoute allowedRoles={[...]}>
//   • When Clerk is integrated, add the SSO callback route:
//       import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
//       <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wrapper that redirects already-authenticated users away from auth pages
 * (sign-in, sign-up) to the dashboard. Prevents logged-in users from
 * seeing the login form again.
 */
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* ── Public auth routes ──────────────────────────────────────────── */}
      <Route
        path="/sign-in"
        element={
          <PublicOnlyRoute>
            <SignInPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/sign-up"
        element={
          <PublicOnlyRoute>
            <SignUpPage />
          </PublicOnlyRoute>
        }
      />

      {/* ── CLERK TODO: Add SSO callback route when Clerk is integrated ── */}
      {/* <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} /> */}

      {/* ── Protected app routes ────────────────────────────────────────── */}
      {/* All children of this layout route are guarded by ProtectedRoute    */}
      {/* and rendered inside AppShell's <Outlet />. Add new dashboard       */}
      {/* views as <Route> children here.                                    */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        {/* Default landing — lightweight stub (see DashboardPage.tsx) */}
        <Route index element={<DashboardPage />} />

        {/* Admin-only route — role-gated */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="mt-2 text-sm text-gray-500">
                  This page is only visible to users with the <strong>admin</strong> role.
                  Replace with your production admin dashboard component.
                </p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* ── ADD NEW PROTECTED ROUTES BELOW ──────────────────────────── */}
        {/* Example:
         * <Route path="reports" element={<ReportsPage />} />
         * <Route path="teams" element={<TeamsPage />} />
         * <Route path="settings" element={
         *   <ProtectedRoute allowedRoles={['admin']}>
         *     <SettingsPage />
         *   </ProtectedRoute>
         * } />
         */}
      </Route>

      {/* ── Fallback ────────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
