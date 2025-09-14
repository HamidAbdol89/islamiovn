import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import type { AuthContextType, GoogleUser } from '@/Pages/Setting/components/types';
import { AUTH_MESSAGES } from '@/Pages/Setting/components/constants';

// Google OAuth Configuration
const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  scope: 'openid profile email https://www.googleapis.com/auth/userinfo.profile',
} as const;

// Real Google Auth API
const googleAuth = {
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
      // Revoke Google token if exists
      const accessToken = localStorage.getItem('muslimviet_access_token');
      if (accessToken) {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
          method: 'POST',
        }).catch(() => {
          // Ignore revoke errors
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  getCurrentUser: (): GoogleUser | null => {
    const stored = localStorage.getItem('muslimviet_user');
    return stored ? JSON.parse(stored) : null;
  },

  exchangeCodeForToken: async (code: string): Promise<GoogleUser> => {
    try {
      // Exchange authorization code for access token
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
      const accessToken = tokenData.access_token;

      // Store access token
      localStorage.setItem('muslimviet_access_token', accessToken);

      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await userResponse.json();

      console.log('Google API userData:', userData);
      
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        verified_email: userData.verified_email,
      };
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

  // Initialize user from localStorage and handle auth callbacks
  useEffect(() => {
    const storedUser = googleAuth.getCurrentUser();
    console.log('AuthContext: Initial stored user:', storedUser);
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userData = await googleAuth.signIn();
      
      // Store user data
      localStorage.setItem('muslimviet_user', JSON.stringify(userData));
      setUser(userData);
      
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
      
      await googleAuth.signOut();
      
      // Clear user data
      localStorage.removeItem('muslimviet_user');
      localStorage.removeItem('muslimviet_access_token');
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
    return await googleAuth.exchangeCodeForToken(code);
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
