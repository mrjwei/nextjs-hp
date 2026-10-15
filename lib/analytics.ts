declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// GA4 property, shared by the gtag snippet in the root layouts and pageview().
export const GA_MEASUREMENT_ID = 'G-44FT4BDFH2';

export const pageview = (url: string) => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// GA4 custom events (docs/roadmap.md §2, Phase 6 Trust & SEO):
// cta_selected_work, cv_download, contact_click, work_card_click.
export const event = (name: string, params?: Record<string, unknown>) => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
};
