import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  AuthState,
  User,
  UserRole,
  SignInPayload,
  SignUpPayload,
  OAuthProvider,
} from "@/types/auth";

// ─────────────────────────────────────────────────────────────────────────────
// AuthContext — Application-Wide Authentication State
// ─────────────────────────────────────────────────────────────────────────────
//
// This React Context provides authentication state and actions to the entire
// component tree. Currently backed by mock/stub implementations for local
// development; designed to be swapped to Clerk's real SDK with minimal effort.
//
// ARCHITECTURE:
//   main.tsx  →  <AuthProvider>       (this file)
//                  └── useAuth()      (consumed by components)
//                  └── useClerkAuth() (facade in hooks/useClerkAuth.ts)
//
// CLERK INTEGRATION CHECKLIST (for backend:
//
//   1. npm install @clerk/clerk-react
//
//   2. In main.tsx, wrap <AuthProvider> with:
//        <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
//          <AuthProvider> ... </AuthProvider>
//        </ClerkProvider>
//
//   3. Replace each stub method below with its Clerk equivalent:
//
//      ┌──────────────────────┬──────────────────────────────────────────────┐
//      │ Current stub         │ Clerk replacement                           │
//      ├──────────────────────┼──────────────────────────────────────────────┤
//      │ signInWithEmail()    │ useSignIn().create({ identifier, password })│
//      │ signUpWithEmail()    │ useSignUp().create({ emailAddress, ... })   │
//      │ signInWithOAuth()    │ clerk.authenticateWithRedirect({ strategy })│
//      │ signOut()            │ clerk.signOut()                             │
//      │ user state           │ useUser() → map to our User type           │
//      └──────────────────────┴──────────────────────────────────────────────┘
//
//   4. Map Clerk's user object to our User interface (see types/auth.ts):
//        const user: User = {
//          id: clerkUser.id,
//          fullName: clerkUser.fullName ?? '',
//          email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
//          role: clerkUser.publicMetadata.role as UserRole,  // set via Clerk dashboard
//          avatarUrl: clerkUser.imageUrl,
//          team: clerkUser.publicMetadata.team as string,
//        };
//
//   5. Remove MOCK_USERS and the mockSignIn() helper once real auth is live.
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Seeded mock users for development / demo ────────────────────────────────
// These allow local testing of both role paths without a running backend.
// Remove once Clerk is integrated.

const MOCK_USERS: Record<string, User> = {
  admin: {
    id: "usr_admin_001",
    fullName: "Alex Rivera",
    email: "alex.rivera@company.com",
    role: "admin",
    avatarUrl: null,
    team: "Engineering",
  },
  member: {
    id: "usr_member_001",
    fullName: "Jamie Chen",
    email: "jamie.chen@company.com",
    role: "member",
    avatarUrl: null,
    team: "Design",
  },
};

// ─── Context shape ───────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  signInWithEmail: (payload: SignInPayload) => Promise<void>;
  signUpWithEmail: (payload: SignUpPayload) => Promise<void>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  signOut: () => void;
  /** Dev-only helper: instantly switch to a seeded mock user by role */
  mockSignIn: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  // ── signInWithEmail ─────────────────────────────────────────────────────
  // CLERK TODO: Replace body with:
  //   const { signIn, setActive } = useSignIn();
  //   const result = await signIn.create({ identifier: payload.email, password: payload.password });
  //   if (result.status === 'complete') await setActive({ session: result.createdSessionId });
  const signInWithEmail = useCallback(async (payload: SignInPayload) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      await new Promise((r) => setTimeout(r, 800)); // simulate network

      // Mock: resolve user by email, default to admin for unknown emails
      const matchedUser = Object.values(MOCK_USERS).find(
        (u) => u.email === payload.email,
      );
      const resolvedUser = matchedUser ?? MOCK_USERS.admin!;
      setAuthState({
        user: resolvedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // ── signUpWithEmail ─────────────────────────────────────────────────────
  // CLERK TODO: Replace body with:
  //   const { signUp, setActive } = useSignUp();
  //   const result = await signUp.create({
  //     emailAddress: payload.email,
  //     password: payload.password,
  //     firstName: payload.fullName.split(' ')[0],
  //     lastName: payload.fullName.split(' ').slice(1).join(' '),
  //   });
  //   if (result.status === 'complete') await setActive({ session: result.createdSessionId });
  const signUpWithEmail = useCallback(async (payload: SignUpPayload) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      await new Promise((r) => setTimeout(r, 800)); // simulate network

      // Mock: create a dynamic user from the sign-up form fields
      const newUser: User = {
        id: `usr_${Date.now()}`,
        fullName: payload.fullName || "New User",
        email: payload.email,
        role: "member", // new sign-ups default to 'member'
        avatarUrl: null,
        team: payload.team || "Unassigned",
      };
      setAuthState({ user: newUser, isAuthenticated: true, isLoading: false });
    } catch {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // ── signInWithOAuth ─────────────────────────────────────────────────────
  // CLERK TODO: Replace body with:
  //   const clerk = useClerk();
  //   await clerk.authenticateWithRedirect({
  //     strategy: provider === 'google' ? 'oauth_google' : 'saml',
  //     redirectUrl: '/sso-callback',
  //     redirectUrlComplete: '/',
  //   });
  const signInWithOAuth = useCallback(async (provider: OAuthProvider) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    console.log(`[AuthContext] OAuth redirect stub for provider: ${provider}`);
    await new Promise((r) => setTimeout(r, 600)); // simulate redirect
    setAuthState({
      user: MOCK_USERS.admin!,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  // ── signOut ─────────────────────────────────────────────────────────────
  // CLERK TODO: Replace with clerk.signOut()
  const signOut = useCallback(() => {
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  // ── mockSignIn (dev-only) ──────────────────────────────────────────────
  // Instantly switches to a seeded user. Remove when Clerk is integrated.
  const mockSignIn = useCallback((role: UserRole) => {
    const user = MOCK_USERS[role];
    if (user) {
      setAuthState({ user, isAuthenticated: true, isLoading: false });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signInWithEmail,
        signUpWithEmail,
        signInWithOAuth,
        signOut,
        mockSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Consume auth state and actions from the nearest <AuthProvider>.
 * Throws if used outside the provider tree.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
