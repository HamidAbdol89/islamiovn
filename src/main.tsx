import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { HelmetProvider } from 'react-helmet-async'; // Thêm import này
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// 👇 Đăng ký SW
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('SW registered', reg))
    .catch(err => console.error('SW registration failed', err));
}

// Thêm viewport meta tag cho mobile (tùy chọn)
const setViewportMeta = () => {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  document.getElementsByTagName('head')[0].appendChild(meta);
};

setViewportMeta();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <HelmetProvider> {/* Bọc bằng HelmetProvider */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
);