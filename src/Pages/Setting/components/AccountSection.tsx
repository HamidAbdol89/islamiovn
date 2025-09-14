import React from 'react';
import { User } from 'lucide-react';
import SettingSection from './SettingSection';
import GoogleLogin from './GoogleLogin';
import { SECTION_TITLES } from './constants';

const AccountSection: React.FC = () => {
  return (
    <SettingSection title={SECTION_TITLES.ACCOUNT}>
      <div className="p-4">
        <div className="flex items-center mb-4">
          <User className="mr-3 w-5 h-5" />
          <span className="font-medium">Tài khoản Google</span>
        </div>
        <GoogleLogin />
      </div>
    </SettingSection>
  );
};

AccountSection.displayName = 'AccountSection';

export default React.memo(AccountSection);
