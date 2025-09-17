// MasjidHeader Component with Vietnamese localization, back button and shadcn UI
import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { VIETNAMESE_TEXT } from '../constants';

interface MasjidHeaderProps {
  tongSoMasjid: number;
  favoritesCount?: number;
}

const MasjidHeader: React.FC<MasjidHeaderProps> = React.memo(({ tongSoMasjid, favoritesCount = 0 }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {VIETNAMESE_TEXT.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {VIETNAMESE_TEXT.subtitle}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-2">
            <div>
              Tổng cộng: <span className="font-semibold text-foreground">{tongSoMasjid}</span> masjid
            </div>
            {favoritesCount > 0 && (
              <div>
                Yêu thích: <span className="font-semibold text-red-500">{favoritesCount}</span> masjid
              </div>
            )}
          </div>
        </div>

        {/* Important Notice */}
        <Alert className="bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-300">
            <strong>{VIETNAMESE_TEXT.importantNotice.title}</strong> {VIETNAMESE_TEXT.importantNotice.content}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
});

MasjidHeader.displayName = 'MasjidHeader';

export default MasjidHeader;
