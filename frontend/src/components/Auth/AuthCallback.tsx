import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, toastPatterns } from '@/lib/toast';
import { useAuth } from '@/context/AuthContext';
import { AUTH_MESSAGES } from '@/Pages/Setting/components/constants';

/**
 * Better Auth handles the OAuth callback automatically via its own route handler.
 * This component is shown while the session is being established, then redirects.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, error } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;

    // Wait until Better Auth finishes loading the session
    if (isLoading) return;

    hasRedirected.current = true;

    if (error) {
      toast.error(error);
      setTimeout(() => navigate('/', { replace: true }), 1500);
      return;
    }

    if (user) {
      toastPatterns.loginSuccess(user.name);
    } else {
      toast.error(AUTH_MESSAGES.LOGIN_ERROR);
    }

    const redirectPath = localStorage.getItem('islamiovn_auth_redirect') || '/';
    localStorage.removeItem('islamiovn_auth_redirect');

    setTimeout(() => navigate(redirectPath, { replace: true }), 1200);
  }, [isLoading, user, error, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 p-4"
    >
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Đang xử lý đăng nhập...
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {user ? `Chào mừng ${user.name}!` : 'Vui lòng đợi trong giây lát'}
        </p>
      </div>
    </motion.div>
  );
};

AuthCallback.displayName = 'AuthCallback';

export default React.memo(AuthCallback);
