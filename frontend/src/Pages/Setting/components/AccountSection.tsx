import React, { useMemo, useCallback, useState } from 'react';
import { CaretDown, CaretUp, EnvelopeSimple, SignIn, SignOut, User } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { AUTH_MESSAGES, SECTION_TITLES, SETTING_LABELS } from './constants';
import SettingSection from './SettingSection';
import type { GoogleLoginButtonProps } from './types';

/* ─── Google Login Button ─────────────────────────────────────── */
const GoogleLoginButton = React.memo<GoogleLoginButtonProps>(({ onSuccess, onError, disabled = false }) => {
  const { login, isLoading } = useAuth();

  const handleLogin = useCallback(async () => {
    try {
      await login();
      onSuccess?.(null as any);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : AUTH_MESSAGES.LOGIN_ERROR);
    }
  }, [login, onSuccess, onError]);

  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleLogin}
        disabled={disabled || isLoading}
        variant="outline"
        size="lg"
        className="w-full gap-2.5"
        data-google-login="true"
      >
        {isLoading ? (
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <SignIn className="w-5 h-5" />
          </motion.span>
        ) : (
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {isLoading ? AUTH_MESSAGES.LOADING : SETTING_LABELS.GOOGLE_LOGIN}
      </Button>
    </motion.div>
  );
});
GoogleLoginButton.displayName = 'GoogleLoginButton';

/* ─── Not-signed-in state ─────────────────────────────────────── */
const SignedOutCard: React.FC<{ error: string | null }> = ({ error }) => (
  <div className="px-4 py-5 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="w-[42px] h-[42px] rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{AUTH_MESSAGES.NOT_SIGNED_IN}</p>
        <p className="text-xs text-muted-foreground">{AUTH_MESSAGES.SIGN_IN_TO_SYNC}</p>
      </div>
    </div>

    <GoogleLoginButton />

    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/* ─── Signed-in state ─────────────────────────────────────────── */
const SignedInCard: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = useCallback(async () => { try { await logout(); } catch {} }, [logout]);

  const initials = useMemo(() => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }, [user?.name]);

  if (!user) return null;

  return (
    <div>
      {/* Profile row */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary transition-colors"
      >
        <Avatar className="w-[42px] h-[42px] flex-shrink-0">
          <AvatarImage src={user.picture} alt={user.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
  <p className="text-sm font-semibold text-foreground truncate">
    {user.name}
  </p>

  {user.verified_email && (
    <img
      src="/icons/verify.png"
      alt="Verified"
      className="w-4 h-4 flex-shrink-0 object-contain"
    />
  )}
</div>
          <div className="flex items-center gap-1 mt-0.5">
            <EnvelopeSimple className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        {expanded
          ? <CaretUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          : <CaretDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        }
      </button>

      {/* Logout panel */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="logout"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border"
          >
            <div className="px-4 py-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-destructive/40 text-destructive hover:bg-destructive/5"
                    size="sm"
                  >
                    <SignOut className="w-4 h-4 mr-2" />
                    {SETTING_LABELS.LOGOUT}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc muốn đăng xuất không? Dữ liệu đã lưu sẽ không bị mất nhưng bạn cần đăng nhập lại để đồng bộ.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      <SignOut className="w-4 h-4 mr-2" />
                      {isLoading ? AUTH_MESSAGES.LOADING : 'Đăng xuất'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── AccountSection ──────────────────────────────────────────── */
const AccountSection: React.FC = () => {
  const { isAuthenticated, error } = useAuth();

  return (
    <SettingSection title={SECTION_TITLES.ACCOUNT} delay={0.05}>
      <AnimatePresence mode="wait">
        {isAuthenticated
          ? <motion.div key="in"  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SignedInCard /></motion.div>
          : <motion.div key="out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SignedOutCard error={error} /></motion.div>
        }
      </AnimatePresence>
    </SettingSection>
  );
};

AccountSection.displayName = 'AccountSection';
export default React.memo(AccountSection);
export { GoogleLoginButton };
