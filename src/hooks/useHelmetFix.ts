// hooks/useHelmetFix.ts
import { useEffect } from 'react';

export const useHelmetFix = (title: string, description: string) => {
  useEffect(() => {
    // Cập nhật title ngay lập tức
    document.title = title;
    
    // Cập nhật meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Cập nhật Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDescription) ogDescription.setAttribute('content', description);
  }, [title, description]);
};