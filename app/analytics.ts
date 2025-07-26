declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const pageview = (url: string) => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('config', 'G-44FT4BDFH2', {
    page_path: url,
  });
};
