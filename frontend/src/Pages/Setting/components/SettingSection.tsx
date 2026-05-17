import React from 'react';
import { motion } from 'motion/react';
import type { SectionProps } from './types';

interface SettingSectionProps extends SectionProps {
  delay?: number;
}

const SettingSection = React.memo<SettingSectionProps>(({ title, children, delay = 0 }) => (
  <motion.div
    className="mb-5"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, delay, ease: 'easeOut' }}
  >
    {/* Section label */}
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2">
      {title}
    </p>

    {/* Card */}
    <div className="bg-card rounded-[var(--radius)] border border-border overflow-hidden shadow-sm">
      {children}
    </div>
  </motion.div>
));

SettingSection.displayName = 'SettingSection';
export default SettingSection;
