import React from 'react';

const SettingHeader: React.FC = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl flex justify-center">
      <img src="/logo.png" alt="Biểu tượng" className="h-32 w-auto" />
    </div>
  );
};

SettingHeader.displayName = 'SettingHeader';

export default React.memo(SettingHeader);
