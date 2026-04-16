export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // In development, use full URL to backend
  if (import.meta.env.DEV) {
    return `http://localhost:8080${imageUrl}`;
  }
  
  // In production, use relative path (nginx proxies)
  return imageUrl;
};
