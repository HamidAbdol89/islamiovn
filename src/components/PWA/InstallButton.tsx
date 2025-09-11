import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInstalledCheck = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    
    setIsInstalled(isInstalledCheck);

    if (!isInstalledCheck) {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        
        // Show install banner after 30 seconds if not dismissed
        setTimeout(() => {
          const dismissed = localStorage.getItem('pwa-install-dismissed');
          if (!dismissed) {
            setShowInstallBanner(true);
          }
        }, 30000);
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Install Banner */}
      {showInstallBanner && (
        <Alert className="fixed bottom-20 left-4 right-4 z-40 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <Download className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <div className="font-medium">Cài đặt Muslim Việt</div>
              <div className="text-sm text-muted-foreground">
                Truy cập nhanh và sử dụng offline
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleInstallClick} size="sm">
                Cài đặt
              </Button>
              <Button onClick={dismissBanner} variant="ghost" size="sm">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Install Button in Settings */}
      {deferredPrompt && (
        <Button onClick={handleInstallClick} className="w-full" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Cài đặt ứng dụng
        </Button>
      )}
    </>
  );
};