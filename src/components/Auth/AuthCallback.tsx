import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { AUTH_MESSAGES } from '@/Pages/Setting/components/constants';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser, setError, exchangeCodeForToken } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check if we have OAuth code in URL params
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        console.log('AuthCallback: URL params:', { code: code ? 'present' : 'missing', error });

        if (error) {
          console.log('AuthCallback: OAuth error from URL:', error);
          setError(`OAuth Error: ${error}`);
          toast.error(`OAuth Error: ${error}`);
          
          // Redirect to home after error
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
          return;
        }

        if (code) {
          console.log('AuthCallback: Processing OAuth code directly');
          
          try {
            // Exchange code for token using googleAuth method
            const userData = await exchangeCodeForToken(code);
            console.log('AuthCallback: Got user data:', userData);
            
            setUser(userData);
            toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
            
            // Get redirect path and navigate
            const redirectPath = localStorage.getItem('muslimviet_auth_redirect') || '/';
            localStorage.removeItem('muslimviet_auth_redirect');
            
            setTimeout(() => {
              navigate(redirectPath, { replace: true });
            }, 1500);
            return;
            
          } catch (exchangeError) {
            console.error('AuthCallback: Token exchange failed:', exchangeError);
            setError('Token exchange failed');
            toast.error('Đăng nhập thất bại');
          }
        }
        // Check for auth success from callback
        const authSuccess = localStorage.getItem('muslimviet_auth_success');
        const authError = localStorage.getItem('muslimviet_auth_error');

        if (authSuccess) {
          localStorage.removeItem('muslimviet_auth_success');
          
          // Get user data from localStorage
          const storedUserData = localStorage.getItem('muslimviet_user');
          console.log('AuthCallback: Processing success, user data:', storedUserData);
          
          if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            console.log('AuthCallback: Setting user:', userData);
            setUser(userData);
            toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
          }
        } else if (authError) {
          localStorage.removeItem('muslimviet_auth_error');
          console.log('AuthCallback: Processing error:', authError);
          setError(authError);
          toast.error(authError);
        } else {
          console.log('AuthCallback: No auth success or error flags found');
        }

        // Get the redirect path or default to home
        const redirectPath = localStorage.getItem('muslimviet_auth_redirect') || '/';
        localStorage.removeItem('muslimviet_auth_redirect');
        
        // Redirect after processing
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1500);

      } catch (error) {
        console.error('Callback processing error:', error);
        navigate('/', { replace: true });
      }
    };

    processCallback();
  }, [navigate, setUser, setError]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 p-4"
    >
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
