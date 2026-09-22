import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import type { UserRole } from '@/types/auth';

// ─────────────────────────────────────────────────────────────────────────────
// ProtectedRoute — Authentication & RBAC Route Guard
// ─────────────────────────────────────────────────────────────────────────────
//
// Wraps any route that requires an authenticated user. Optionally enforces
// role-based access control via the `allowedRoles` prop.
//
// BEHAVIOUR:
//   1. isLoading=true  → shows a branded spinner (e.g. while Clerk resolves)
//   2. !isAuthenticated → redirects to /sign-in, preserving the intended
//                         destination in location.state.from for post-login
//                         redirect (your Clerk callback should read this).
//   3. Role mismatch   → renders an "Access Denied" card with required role.
//   4. All checks pass → renders children.
//
// USAGE:
//   <ProtectedRoute>                     — any authenticated user
//     <SomePage />
//   </ProtectedRoute>
//
//   <ProtectedRoute allowedRoles={['admin']}>  — admin only
//     <AdminPage />
//   </ProtectedRoute>
//
// INTEGRATION NOTES (for backend team):
//   • This component reads auth state from useAuth() (AuthContext).
//     When Clerk is wired in, AuthContext will be backed by real session
//     data — no changes needed here.
//   • For server-side route protection, pair this with Clerk's authMiddleware()
//     in your Express/Next.js backend to double-gate sensitive routes.
//   • The `from` state on the redirect enables post-login navigation:
//       const { state } = useLocation();
//       navigate(state?.from?.pathname || '/');
//
// ─────────────────────────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If specified, the user's role must be in this list to access the route */
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // ── Loading state (Clerk session resolving) ───────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-mango-blue-200 border-t-mango-blue-600" />
          <p className="text-sm text-gray-500">Verifying access…</p>
        </div>
      </div>
    );
  }

  // ── Not authenticated → redirect to sign-in ───────────────────────────
  // Preserves location so Clerk callback can redirect back after login
  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // ── Role-based access check ───────────────────────────────────────────
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">Access Denied</h2>
          <p className="mb-4 text-sm text-gray-500">
            You don't have permission to access this page.<br />
            Required role: <span className="font-semibold">{allowedRoles.join(' or ')}</span>
          </p>
          <a
            href="/"
            className="inline-block rounded-lg bg-mango-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-mango-blue-700"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
