// ─────────────────────────────────────────────────────────────────────────────
// Project Mango — Auth Types & Models
// ─────────────────────────────────────────────────────────────────────────────

/** Available user roles for RBAC */
export type UserRole = 'admin' | 'member';

/** Core user model returned from authentication */
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  team: string;
}

/** Global authentication state */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** Payload for email/password sign-in */
export interface SignInPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

/** Payload for email/password sign-up */
export interface SignUpPayload {
  fullName: string;
  email: string;
  team: string;
  password: string;
  agreedToTerms: boolean;
}

/** OAuth / SSO provider identifiers */
export type OAuthProvider = 'google' | 'okta_sso';
