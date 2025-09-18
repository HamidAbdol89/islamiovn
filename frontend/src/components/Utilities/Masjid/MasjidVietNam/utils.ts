// Utility functions for MasjidVietnam Component

// Format number with Vietnamese locale
export const formatNumber = (num: number): string => {
  return num.toLocaleString('vi-VN');
};

// Format text with placeholders
export const formatText = (template: string, values: Record<string, string | number>): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
};
