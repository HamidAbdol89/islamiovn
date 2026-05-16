import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
        <Alert className="fixed bottom-4 left-4 right-4 z-50 bg-background border border-border shadow-luxury backdrop-blur-lg bg-white/90 dark:bg-navy-950/90">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full mt-0.5">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <AlertTitle className="text-base font-semibold">Cài đặt Islam.io.vn</AlertTitle>
              <AlertDescription className="text-muted-foreground mt-1">
                Truy cập nhanh và sử dụng offline
              </AlertDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleInstallClick} size="sm">
                Cài đặt
              </Button>
              <Button onClick={dismissBanner} variant="ghost" size="icon" className="h-9 w-9">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Alert>
      )}

      {/* Install Button in Settings */}
      {deferredPrompt && (
        <Card className="w-full border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              Ứng dụng
            </CardTitle>
            <CardDescription>
              Cài đặt ứng dụng để trải nghiệm tốt hơn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleInstallClick} className="w-full" variant="default">
              <Download className="h-4 w-4 mr-2" />
              Cài đặt ứng dụng
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};