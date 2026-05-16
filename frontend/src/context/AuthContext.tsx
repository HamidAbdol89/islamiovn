import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from '@/lib/firebase';
import { toastPatterns, toast } from '@/lib/toast';
import { AUTH_MESSAGES } from '@/Pages/Setting/components/constants';
import type { AuthContextType, AppUser } from '@/Pages/Setting/components/types';

declare global {
  interface Window {
    queryClient?: any;
  }
}

/** Convert Firebase user → AppUser */
const toAppUser = (fbUser: FirebaseUser): AppUser => ({
  id: fbUser.uid,
  email: fbUser.email ?? '',
  name: fbUser.displayName ?? '',
  picture: fbUser.photoURL ?? undefined,
  verified_email: fbUser.emailVerified,
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = React.memo<{ children: React.ReactNode }>(({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true until Firebase resolves
  const [error, setError] = useState<string | null>(null);

  // Listen to Firebase auth state — fires on page load, login, logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(toAppUser(fbUser));

        // Send Firebase ID token to backend to create/update user record
        try {
          const idToken = await fbUser.getIdToken();
          await fetch(
            `${import.meta.env.VITE_API_URL_USER || 'https://islamiovn-production.up.railway.app/api'}/auth/firebase`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`,
              },
            }
          );
        } catch {
          // Non-critical — user is still logged in on frontend
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Invalidate React Query cache when auth changes
  useEffect(() => {
    if (!isLoading && window.queryClient) {
      window.queryClient.invalidateQueries(['hadith-favorites']);
      window.queryClient.invalidateQueries(['hadith-bookmarks']);
      window.queryClient.invalidateQueries(['hadith-favorites-count']);
      window.queryClient.invalidateQueries(['hadith-bookmarks-count']);
    }
  }, [user, isLoading]);

  const login = useCallback(async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      toastPatterns.loginSuccess(result.user.displayName ?? 'bạn');
    } catch (err: any) {
      // User closed popup — not a real error
      if (err?.code === 'auth/popup-closed-by-user') return;
      const msg = err?.message ?? AUTH_MESSAGES.LOGIN_ERROR;
      setError(msg);
      toast.error(msg);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      toastPatterns.logoutSuccess();
    } catch (err: any) {
      const msg = err?.message ?? AUTH_MESSAGES.LOGOUT_ERROR;
      setError(msg);
      toast.error(msg);
    }
  }, []);

  // Global login trigger (used by other components)
  useEffect(() => {
    const handle = () => { if (!user) login(); };
    window.addEventListener('triggerGoogleLogin', handle);
    return () => window.removeEventListener('triggerGoogleLogin', handle);
  }, [login, user]);

  const isAuthenticated = user !== null;

  const contextValue = useMemo<AuthContextType>(
    () => ({ user, isLoading, isAuthenticated, login, logout, error }),
    [user, isLoading, isAuthenticated, login, logout, error]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
});

AuthProvider.displayName = 'AuthProvider';

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
