import { memo } from 'react';
import { VAN_BAN_VI } from './constants';

const LoadingSpinner = memo(() => (
  <div className="w-full min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center p-16 rounded-3xl bg-card backdrop-blur-xl border border-border shadow-luxury">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-muted rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-primary rounded-full animate-spin" />
      </div>
      <span className="font-medium text-lg text-muted-foreground tracking-wide">
        {VAN_BAN_VI.DANG_TAI}
      </span>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
