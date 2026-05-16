import React, { createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { toastPatterns, toast } from '@/lib/toast';
import { AUTH_MESSAGES } from '@/Pages/Setting/components/constants';
import type { AuthContextType, AppUser } from '@/Pages/Setting/components/types';

// Extend window interface for queryClient
declare global {
  interface Window {
    queryClient?: any;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

export const AuthProvider = React.memo<AuthProviderProps>(({ children }) => {
  // Better Auth reactive session — automatically updates on login/logout
  const { data: session, isPending: isLoading, error: sessionError } = authClient.useSession();

  const user: AppUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        picture: session.user.image ?? undefined,
        verified_email: session.user.emailVerified ?? false,
      }
    : null;

  const isAuthenticated = user !== null;

  // Invalidate React Query cache when auth state changes
  useEffect(() => {
    if (window.queryClient) {
      window.queryClient.invalidateQueries(['hadith-favorites']);
      window.queryClient.invalidateQueries(['hadith-bookmarks']);
      window.queryClient.invalidateQueries(['hadith-favorites-count']);
      window.queryClient.invalidateQueries(['hadith-bookmarks-count']);
    }
  }, [isAuthenticated]);

  const login = useCallback(async (): Promise<void> => {
    try {
      // Store current location for redirect back after OAuth
      localStorage.setItem('islamiovn_auth_redirect', window.location.pathname);

      await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/auth/callback`,
      });
      // Page will redirect — no further code runs here
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : AUTH_MESSAGES.LOGIN_ERROR;
      toast.error(errorMessage);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authClient.signOut();
      toastPatterns.logoutSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : AUTH_MESSAGES.LOGOUT_ERROR;
      toast.error(errorMessage);
    }
  }, []);

  // Listen for global login trigger events (used by other components)
  useEffect(() => {
    const handleGlobalLogin = () => {
      if (!isAuthenticated) {
        login();
      }
    };

    window.addEventListener('triggerGoogleLogin', handleGlobalLogin);
    return () => window.removeEventListener('triggerGoogleLogin', handleGlobalLogin);
  }, [login, isAuthenticated]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      error: sessionError?.message ?? null,
    }),
    [user, isLoading, isAuthenticated, login, logout, sessionError]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
});

AuthProvider.displayName = 'AuthProvider';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
