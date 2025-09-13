// QuranApp.tsx - Main Quran application component
import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import QuranReader from './QuranReader';
import './globals.css';

interface QuranAppProps {
  className?: string;
}

const QuranApp: React.FC<QuranAppProps> = React.memo(({ className = '' }) => {
  return (
    <div className={`quran-app ${className}`}>
      <Suspense 
        fallback={
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Đang tải Quran...</p>
            </CardContent>
          </Card>
        }
      >
        <QuranReader />
      </Suspense>
    </div>
  );
});

QuranApp.displayName = 'QuranApp';

export default QuranApp;
