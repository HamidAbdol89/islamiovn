import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Firebase dùng popup — không cần callback page.
 * Redirect về home nếu user vào route này trực tiếp.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = localStorage.getItem('islamiovn_auth_redirect') || '/';
    localStorage.removeItem('islamiovn_auth_redirect');
    navigate(redirectPath, { replace: true });
  }, [navigate]);

  return null;
};

export default AuthCallback;
