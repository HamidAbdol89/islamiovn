import React, { useMemo, useCallback } from 'react';
import { LogIn, LogOut, User, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';
import { AUTH_MESSAGES, SETTING_LABELS } from './constants';
import type { GoogleLoginButtonProps } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const GoogleLoginButton = React.memo<GoogleLoginButtonProps>(({ 
  onSuccess, 
  onError, 
  disabled = false 
}) => {
  const { login, isLoading } = useAuth();

  const handleLogin = useCallback(async () => {
    try {
      await login();
      onSuccess?.(null as any);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : AUTH_MESSAGES.LOGIN_ERROR;
      onError?.(errorMessage);
    }
  }, [login, onSuccess, onError]);

  const buttonText = useMemo(() => 
    isLoading ? AUTH_MESSAGES.LOADING : SETTING_LABELS.GOOGLE_LOGIN,
    [isLoading]
  );

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Button
        onClick={handleLogin}
        disabled={disabled || isLoading}
        variant="outline"
        size="lg"
        className="w-full"
        data-google-login="true"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <LogIn className="w-5 h-5 mr-2" />
          </motion.div>
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {buttonText}
      </Button>
    </motion.div>
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
<motion.div
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
  className="mt-1 flex items-center gap-1"
>
  <Badge variant="verified" className="w-4 h-4 p-0 flex items-center justify-center">
    <Check className="w-3 h-3 text-white" />
  </Badge>
  <span className="text-xs">Đã xác thực</span>
</motion.div>

    );
  }, [user?.verified_email]);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="mb-4">
        <CardContent className="p-4">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
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
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center mb-1"
              >
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                <h3 className="font-semibold text-foreground truncate">
                  {user.name}
                </h3>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-center text-muted-foreground"
              >
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm truncate">{user.email}</span>
              </motion.div>
              
              {verificationBadge}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    disabled={isLoading}
                    variant="outline"
                    className="w-full mt-4"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {SETTING_LABELS.LOGOUT}
                  </Button>
                </motion.div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Google không? 
                    Dữ liệu đã lưu sẽ không bị mất nhưng bạn sẽ cần đăng nhập lại để đồng bộ.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <LogOut className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <LogOut className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? AUTH_MESSAGES.LOADING : 'Đăng xuất'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card className="mb-4">
          <CardContent className="p-4">
            <motion.div 
              className="text-center mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold text-foreground mb-2">
                {AUTH_MESSAGES.NOT_SIGNED_IN}
              </h3>
              <p className="text-sm text-muted-foreground">
                {AUTH_MESSAGES.SIGN_IN_TO_SYNC}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GoogleLoginButton />
            </motion.div>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="mt-3 overflow-hidden"
                >
                  <Alert variant="destructive">
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    );
  }, [isAuthenticated, error]);

  return (
    <AnimatePresence mode="wait">
      {loginSection}
    </AnimatePresence>
  );
};

GoogleLogin.displayName = 'GoogleLogin';

export default React.memo(GoogleLogin);
export { GoogleLoginButton, UserProfile };