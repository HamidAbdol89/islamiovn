import React, { useMemo, useCallback } from 'react';
import { LogIn, LogOut, User, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { AUTH_MESSAGES, SETTING_LABELS } from './constants';
import type { GoogleLoginButtonProps } from './types';

const GoogleLoginButton = React.memo<GoogleLoginButtonProps>(({ 
  onSuccess, 
  onError, 
  disabled = false 
}) => {
  const { login, isLoading } = useAuth();

  const handleLogin = useCallback(async () => {
    try {
      await login();
      onSuccess?.(null as any); // Will be called from context
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : AUTH_MESSAGES.LOGIN_ERROR;
      onError?.(errorMessage);
    }
  }, [login, onSuccess, onError]);

  const buttonText = useMemo(() => 
    isLoading ? AUTH_MESSAGES.LOADING : SETTING_LABELS.GOOGLE_LOGIN,
    [isLoading]
  );

  const buttonClassName = useMemo(() =>
    `w-full bg-card hover:bg-accent text-card-foreground border border-border transition-colors ${
      disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    [disabled, isLoading]
  );

  return (
    <Button
      onClick={handleLogin}
      disabled={disabled || isLoading}
      className={buttonClassName}
      size="lg"
    >
      <LogIn className="w-5 h-5 mr-2" />
      {buttonText}
    </Button>
  );
});

GoogleLoginButton.displayName = 'GoogleLoginButton';

const UserProfile = React.memo(() => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      // Error handling is done in context
    }
  }, [logout]);

  const userInitials = useMemo(() => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  const verificationBadge = useMemo(() => {
    if (!user?.verified_email) return null;
    
    return (
      <div className="flex items-center text-primary text-sm mt-1">
        <Shield className="w-4 h-4 mr-1" />
        <span>Đã xác thực</span>
      </div>
    );
  }, [user?.verified_email]);

  if (!user) return null;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage 
              src={user.picture} 
              alt={user.name}
              onError={() => console.log('Avatar image failed to load:', user.picture)}
              onLoad={() => console.log('Avatar image loaded successfully:', user.picture)}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-1">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <h3 className="font-semibold text-foreground truncate">
                {user.name}
              </h3>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-sm truncate">{user.email}</span>
            </div>
            
            {verificationBadge}
          </div>
        </div>
        
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          variant="outline"
          className="w-full mt-4"
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoading ? AUTH_MESSAGES.LOADING : SETTING_LABELS.LOGOUT}
        </Button>
      </CardContent>
    </Card>
  );
});

UserProfile.displayName = 'UserProfile';

const GoogleLogin: React.FC = () => {
  const { isAuthenticated, error, user } = useAuth();
  
  console.log('GoogleLogin: isAuthenticated:', isAuthenticated);
  console.log('GoogleLogin: user:', user);
  console.log('GoogleLogin: user.picture:', user?.picture);
  console.log('GoogleLogin: error:', error);

  const loginSection = useMemo(() => {
    if (isAuthenticated) {
      return <UserProfile />;
    }

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-foreground mb-2">
              {AUTH_MESSAGES.NOT_SIGNED_IN}
            </h3>
            <p className="text-sm text-muted-foreground">
              {AUTH_MESSAGES.SIGN_IN_TO_SYNC}
            </p>
          </div>
          
          <GoogleLoginButton />
          
          {error && (
            <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }, [isAuthenticated, error]);

  return loginSection;
};

GoogleLogin.displayName = 'GoogleLogin';

export default React.memo(GoogleLogin);
export { GoogleLoginButton, UserProfile };
