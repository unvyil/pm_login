// ─────────────────────────────────────────────────────────────────────────────
// useClerkAuth — Clerk Integration Facade
// ─────────────────────────────────────────────────────────────────────────────
//
// WHAT THIS IS:
//   A thin adapter hook that isolates Clerk-specific auth logic behind a
//   stable API surface. All components import from HERE, not directly from
//   Clerk or AuthContext. This means the backend team can swap the internals
//   without touching any UI components.
//
// CURRENT STATE (mock):
//   Delegates entirely to AuthContext's mock implementations. Sign-in/sign-up
//   resolve against seeded MOCK_USERS. OAuth stubs log to console.
//
// ── CLERK MIGRATION GUIDE ────────────────────────────────────────────────────
//
//   Step 1: Install Clerk
//     npm install @clerk/clerk-react
//
//   Step 2: Add ClerkProvider in main.tsx (see TODO comment there)
//     <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
//       <AuthProvider> ... </AuthProvider>
//     </ClerkProvider>
//
//   Step 3: Update this hook's internals:
//
//     import { useSignIn, useSignUp, useUser, useClerk } from '@clerk/clerk-react';
//
//     export function useClerkAuth() {
//       const { signIn, setActive: setSignInActive } = useSignIn();
//       const { signUp, setActive: setSignUpActive } = useSignUp();
//       const { user: clerkUser, isLoaded, isSignedIn } = useUser();
//       const clerk = useClerk();
//
//       // Map Clerk user → our User type
//       const user: User | null = clerkUser ? {
//         id: clerkUser.id,
//         fullName: clerkUser.fullName ?? '',
//         email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
//         role: (clerkUser.publicMetadata.role as UserRole) ?? 'member',
//         avatarUrl: clerkUser.imageUrl,
//         team: (clerkUser.publicMetadata.team as string) ?? 'Unassigned',
//       } : null;
//
//       return {
//         user,
//         isAuthenticated: isSignedIn,
//         isLoading: !isLoaded,
//         signInWithEmail: (p) => signIn.create({ identifier: p.email, password: p.password }),
//         signUpWithEmail: (p) => signUp.create({ emailAddress: p.email, password: p.password }),
//         signInWithOAuth: (provider) => clerk.authenticateWithRedirect({
//           strategy: provider === 'google' ? 'oauth_google' : 'saml',
//           redirectUrl: '/sso-callback',
//           redirectUrlComplete: '/',
//         }),
//         signOut: () => clerk.signOut(),
//       };
//     }
//
//   Step 4: Remove the mock AuthContext provider (or keep it as a test double)
//
//   Step 5: Add SSO callback route in App.tsx:
//     import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
//     <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
//
// ─────────────────────────────────────────────────────────────────────────────

import { useAuth } from '@/features/auth/context/AuthContext';

/**
 * Facade hook for Clerk authentication.
 *
 * Currently delegates to the mock AuthContext. When Clerk is integrated,
 * swap the internals here — all consumer components stay unchanged.
 */
export function useClerkAuth() {
  const auth = useAuth();

  return {
    // ── State (read from session) ─────────────────────────────────────
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,

    // ── Actions ───────────────────────────────────────────────────────
    /** CLERK TODO: useSignIn().create({ identifier, password }) */
    signInWithEmail: auth.signInWithEmail,

    /** CLERK TODO: useSignUp().create({ emailAddress, password, firstName, lastName }) */
    signUpWithEmail: auth.signUpWithEmail,

    /** CLERK TODO: clerk.authenticateWithRedirect({ strategy, redirectUrl }) */
    signInWithOAuth: auth.signInWithOAuth,

    /** CLERK TODO: clerk.signOut() */
    signOut: auth.signOut,

    // ── Dev-only (remove after Clerk integration) ─────────────────────
    mockSignIn: auth.mockSignIn,
  };
}
