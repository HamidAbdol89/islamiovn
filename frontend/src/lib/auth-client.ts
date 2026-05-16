import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client.
 * baseURL points to the backend server root (not /api) — Better Auth is mounted at /api/auth.
 */
const BETTER_AUTH_BASE_URL =
  (import.meta.env.VITE_BETTER_AUTH_URL as string | undefined) ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://islamiovn-production.up.railway.app');

export const authClient = createAuthClient({
  baseURL: BETTER_AUTH_BASE_URL,
});

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
