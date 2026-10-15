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

// GA4 custom events (docs/roadmap.md §2, Phase 6 Trust & SEO):
// cta_selected_work, cv_download, contact_click, work_card_click.
export const event = (name: string, params?: Record<string, unknown>) => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
};
