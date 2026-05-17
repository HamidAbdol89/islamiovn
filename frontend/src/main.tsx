import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/mobile-scroll.css";
import "./styles/scrollbar.css";
import { AuthProvider } from "@/context/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { HadithUserHydrator } from "@/hydration/HadithUserHydrator";
import { QuranHydrator } from "@/hydration/QuranHydrator";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('SW registered', reg))
    .catch(err => console.error('SW registration failed', err));
}

const setViewportMeta = () => {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  document.getElementsByTagName('head')[0].appendChild(meta);
};

setViewportMeta();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <HadithUserHydrator />
        <QuranHydrator />
        <Toaster richColors position="top-center" theme="system" />
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
