import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
}

const SEOHead: React.FC<SEOHeadProps> =  ({
  title = 'Islam.io.vn - Ứng dụng Hồi giáo dành cho cộng đồng Muslim Việt Nam',
  description = 'Ứng dụng toàn diện cho cộng đồng Hồi giáo Việt Nam với đầy đủ các công cụ: lịch cầu nguyện, Quran, Qiblah, Hadith, Zakat, Tasbih, Dua và trí tuệ nhân tạo Mira AI.',
  image = 'https://islam.io.vn/images/social-share.jpg',
  url = 'https://islam.io.vn/',
  type = 'website',
  keywords = []
}) => {
  const defaultKeywords = ['islam.io.vn', 'hồi giáo', 'islam', 'cầu nguyện', 'quran', 'qiblah', 'masjid', 'zakat', 'tasbih', 'dua', 'hadith'];
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Islam.io.vn" />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="author" content="Islam.io.vn" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Vietnamese" />

      {/* App-specific Meta Tags */}
      <meta name="application-name" content="Islam.io.vn" />
      <meta name="apple-mobile-web-app-title" content="Islam.io.vn" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
    </Helmet>
  );
};
export default SEOHead;
