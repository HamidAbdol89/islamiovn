import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, toastPatterns } from '@/lib/toast';
import { authClient } from '@/lib/auth-client';
import { AUTH_MESSAGES } from '@/Pages/Setting/components/constants';

/**
 * Better Auth OAuth callback handler.
 * After Google redirects back here, Better Auth has already set the session cookie.
 * We just need to verify the session is active then redirect.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processCallback = async () => {
      // Check URL for error param from Better Auth
      const params = new URLSearchParams(window.location.search);
      const error = params.get('error');

      if (error) {
        setStatus('error');
        toast.error(`Đăng nhập thất bại: ${error}`);
        setTimeout(() => navigate('/', { replace: true }), 2000);
        return;
      }

      // Poll for session — Better Auth may need a moment to finalize
      let session = null;
      for (let i = 0; i < 5; i++) {
        try {
          const result = await authClient.getSession();
          if (result?.data?.user) {
            session = result.data;
            break;
          }
        } catch {
          // ignore, retry
        }
        await new Promise((r) => setTimeout(r, 600));
      }

      if (session?.user) {
        setUserName(session.user.name || '');
        setStatus('success');
        toastPatterns.loginSuccess(session.user.name || 'bạn');

        const redirectPath = localStorage.getItem('islamiovn_auth_redirect') || '/';
        localStorage.removeItem('islamiovn_auth_redirect');
        setTimeout(() => navigate(redirectPath, { replace: true }), 1000);
      } else {
        setStatus('error');
        toast.error(AUTH_MESSAGES.LOGIN_ERROR);
        setTimeout(() => navigate('/', { replace: true }), 2000);
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 p-4"
    >
      <div className="text-center max-w-md mx-auto">
        {status !== 'error' && (
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        )}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {status === 'success'
            ? `Chào mừng ${userName}!`
            : status === 'error'
            ? 'Đăng nhập thất bại'
            : 'Đang xử lý đăng nhập...'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {status === 'loading' ? 'Vui lòng đợi trong giây lát' : ''}
        </p>
      </div>
    </motion.div>
  );
};

AuthCallback.displayName = 'AuthCallback';

export default React.memo(AuthCallback);
