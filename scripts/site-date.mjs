// The site's calendar day. A post dated YYYY-MM-DD goes live at midnight on that day in this time zone,
// wherever the build runs (Vercel and GitHub Actions run in UTC) and wherever the author is.
export const SITE_TIME_ZONE = "Australia/Brisbane";

// Today in the site's time zone, as YYYY-MM-DD (en-CA formats dates that way).
export function siteToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
