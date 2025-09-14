import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SectionProps } from './types';

const SettingSection = React.memo<SectionProps>(({ title, children }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-0">
        {children}
      </CardContent>
    </Card>
  );
});

SettingSection.displayName = 'SettingSection';

export default SettingSection;
