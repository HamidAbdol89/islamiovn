import React from 'react';
import { motion } from 'motion/react';

const SettingHeader: React.FC = () => (
  <motion.div
    className="flex flex-col items-center gap-1.5 py-8"
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {/* Gradient icon mark */}
     <img src="/logo.png" alt="Islam.io logo" className="w-[80px] h-[80px]" />
    <p className="text-xs text-muted-foreground">Islam.io.vn</p>
  </motion.div>
);

SettingHeader.displayName = 'SettingHeader';
export default React.memo(SettingHeader);
