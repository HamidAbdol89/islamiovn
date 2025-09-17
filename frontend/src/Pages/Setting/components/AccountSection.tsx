import React from 'react';
import SettingSection from './SettingSection';
import GoogleLogin from './GoogleLogin';
import { SECTION_TITLES } from './constants';

const AccountSection: React.FC = () => {
  return (
    <SettingSection  title={SECTION_TITLES.ACCOUNT}>
    
        <GoogleLogin />
    </SettingSection>
  );
};

AccountSection.displayName = 'AccountSection';

export default React.memo(AccountSection);
