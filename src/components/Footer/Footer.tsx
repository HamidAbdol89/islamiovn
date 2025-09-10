import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 py-6 border-t border-slate-200 dark:border-slate-700 text-center">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
        © {new Date().getFullYear()} Tiện ích Hồi Giáo Việt Nam. Tất cả quyền được bảo lưu.
      </p>
      
      {/* Footer Links */}
      <div className="flex justify-center space-x-4 text-xs">
        <a href="/about" className="hover:underline text-slate-600 dark:text-slate-300">About</a>
        <a href="/privacy" className="hover:underline text-slate-600 dark:text-slate-300">Privacy Policy</a>
        <a href="/terms" className="hover:underline text-slate-600 dark:text-slate-300">Terms of Service</a>
        <a href="/contact" className="hover:underline text-slate-600 dark:text-slate-300">Contact</a>
      </div>
    </footer>
  );
};

export default Footer;