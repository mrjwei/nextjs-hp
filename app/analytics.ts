declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const pageview = (url: string) => {
  window.gtag('config', 'G-44FT4BDFH2', {
    page_path: url,
  });
};
