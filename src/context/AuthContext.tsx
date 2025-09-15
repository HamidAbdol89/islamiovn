import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import type { AuthContextType, GoogleUser } from '@/Pages/Setting/components/types';
import { AUTH_MESSAGES } from '@/Pages/Setting/components/constants';
import apiService from '@/services/backendApi';
import { hybridFavoriteService } from '@/services/hybridFavoriteService';
import { hybridBookmarkService } from '@/services/hybridBookmarkService';

// Extend window interface for queryClient
declare global {
  interface Window {
    queryClient?: any;
  }
}

// Google OAuth Configuration
const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  scope: 'openid profile email https://www.googleapis.com/auth/userinfo.profile',
} as const;

// Backend API Authentication
const backendAuth = {
  signIn: async (): Promise<GoogleUser> => {
    try {
      // Store current location for redirect back
      localStorage.setItem('muslimviet_auth_redirect', window.location.pathname);
      
      // Create OAuth URL for redirect flow
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', GOOGLE_CONFIG.clientId);
      authUrl.searchParams.set('redirect_uri', GOOGLE_CONFIG.redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', GOOGLE_CONFIG.scope);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('state', 'oauth_redirect');

      // Redirect to Google OAuth
      window.location.href = authUrl.toString();
      
      // This promise will never resolve as we're redirecting
      return new Promise(() => {});
    } catch (error) {
      console.error('Google Auth Error:', error);
      throw error;
    }
  },

  signOut: async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  getCurrentUser: (): GoogleUser | null => {
    // This will be handled by the backend API
    return null;
  },

  exchangeCodeForToken: async (code: string): Promise<GoogleUser> => {
    try {
      // Get Google access token first
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CONFIG.clientId,
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: GOOGLE_CONFIG.redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Token exchange failed');
      }

      const tokenData = await tokenResponse.json();
      const googleAccessToken = tokenData.access_token;

      // Use backend API to authenticate with Google token
      const response = await apiService.googleAuth(googleAccessToken);
      
      return response.user;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

export const AuthProvider = React.memo<AuthProviderProps>(({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize user from backend API
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing auth...');
        console.log('AuthContext: JWT token exists:', !!apiService.getToken());
        
        if (apiService.isAuthenticated()) {
          console.log('AuthContext: User is authenticated, getting current user');
          const userData = await apiService.getCurrentUser();
          console.log('AuthContext: Got user data:', userData);
          setUser(userData.user);
        } else {
          console.log('AuthContext: User not authenticated');
        }
      } catch (error) {
        console.log('AuthContext: Failed to get current user, clearing auth:', error);
        apiService.logout();
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userData = await backendAuth.signIn();
      
      // Store user data
      setUser(userData);
      
      // Clear React Query cache to force refresh
      if (window.queryClient) {
        window.queryClient.invalidateQueries(['hadith-favorites']);
        window.queryClient.invalidateQueries(['hadith-bookmarks']);
        window.queryClient.invalidateQueries(['hadith-favorites-count']);
        window.queryClient.invalidateQueries(['hadith-bookmarks-count']);
        console.log('React Query cache cleared');
      }
      
      // Sync local data to backend
      try {
        console.log('Syncing local data to backend...');
        await Promise.all([
          hybridFavoriteService.syncLocalToBackend(true),
          hybridBookmarkService.syncLocalToBackend(true)
        ]);
        console.log('Local data synced to backend successfully');
      } catch (syncError) {
        console.error('Failed to sync local data to backend:', syncError);
        // Don't show error to user, just log it
      }
      
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : AUTH_MESSAGES.LOGIN_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await backendAuth.signOut();
      
      // Clear user data
      setUser(null);
      
      toast.success(AUTH_MESSAGES.LOGOUT_SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : AUTH_MESSAGES.LOGOUT_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = useMemo(() => user !== null, [user]);

  const exchangeCodeForToken = useCallback(async (code: string): Promise<GoogleUser> => {
    return await backendAuth.exchangeCodeForToken(code);
  }, []);

  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    error,
    setUser,
    setError,
    exchangeCodeForToken,
  }), [user, isLoading, isAuthenticated, login, logout, error, exchangeCodeForToken, setUser, setError]);

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
