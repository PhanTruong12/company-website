import { useEffect } from 'react';

export interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  url?: string;
  type?: string;
}

/**
 * Cập nhật meta tags trong head để hiển thị đúng khi share lên Facebook/mạng xã hội
 */
export function useMetaTags(config: MetaTagsConfig) {
  useEffect(() => {
    const {
      title = 'TND Granite',
      description = 'Xem bài viết trên TND Granite',
      image = 'https://tndgranite.com/logo.jpg',
      imageWidth = 1200,
      imageHeight = 630,
      url = window.location.href,
      type = 'article',
    } = config;

    // Hàm helper để tạo hoặc cập nhật meta tag
    const setMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        const attr = name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name';
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Open Graph meta tags (Facebook)
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:image', image);
    setMetaTag('og:image:width', imageWidth.toString());
    setMetaTag('og:image:height', imageHeight.toString());
    setMetaTag('og:url', url);
    setMetaTag('og:type', type);
    setMetaTag('og:site_name', 'TND Granite');

    // Twitter Card meta tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Standard meta tags
    setMetaTag('description', description);

    // Update page title
    document.title = title;

    return () => {
      // Cleanup: restore default meta tags khi component unmount
      const defaults = {
        'og:title': 'TND Granite - Đá hoa cương chất lượng cao',
        'og:description': 'TND Granite - Chuyên cung cấp đá hoa cương, đá nước ngoài với chất lượng cao, giá cạnh tranh.',
        'og:image': 'https://tndgranite.com/logo.jpg',
        'og:type': 'website',
        'description': 'TND Granite - Chuyên cung cấp đá hoa cương',
      };

      Object.entries(defaults).forEach(([key, value]) => {
        setMetaTag(key, value);
      });
      
      document.title = 'TND Granite';
    };
  }, [config]);
}
